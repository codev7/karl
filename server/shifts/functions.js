Meteor.methods({
  'clockIn': function(id) {
    if(!id) {
      logger.error("Shift id not found");
      throw new Meteor.Error(404, "Shift id not found");
    }
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var shift = Shifts.findOne({"_id": id});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo != user._id && user.isWorker == true) {
      logger.error("You don't have permission to clock in");
      throw new Meteor.Error(404, "You don't have permission to clock in");
    }
    Shifts.update({"_id": id}, {$set: {"status": "started", "startedAt": new Date().getTime()}});
    logger.info("Shift started", {"shiftId": id, "worker": user._id});
  },

  'clockOut': function(id) {
    if(!id) {
      logger.error("Shift id not found");
      throw new Meteor.Error(404, "Shift id not found");
    }
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var shift = Shifts.findOne({"_id": id, "status": "started"});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo != user._id && user.isWorker == true) {
      logger.error("You don't have permission to clock out");
      throw new Meteor.Error(404, "You don't have permission to clock out");
    }
    Shifts.update({"_id": id}, {$set: {"status": "finished", "finishedAt": new Date().getTime()}});
    logger.info("Shift ended", {"shiftId": id, "worker": user._id});
  },

  'editClock': function(id, info) {
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to delete shifts");
      throw new Meteor.Error(403, "User not permitted to delete shifts ");
    }
    if(!id) {
      logger.error("Shift id not found");
      throw new Meteor.Error(404, "Shift id not found");
    }
    var shift = Shifts.findOne({"_id": id});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    // if(shift.status == "started") {
    //   logger.error("Shift has started. Can't change time till it's finished");
    //   throw new Meteor.Error(404, "Shift has started. Can't change time till it's finished");
    // }
    var updateDoc = {};
    if(info.startDraft) {
      if(!shift.startedAt) {
        updateDoc.startedAt = info.startDraft;
        updateDoc.status = "started";
      }
    } else {
      if(info.startedAt) {
        var startTime = new Date(info.startedAt).getTime();
        if(startTime != shift.startedAt) {
          if(startTime > shift.finishedAt) {
            logger.error("Start time should be less than finished time");
            throw new Meteor.Error(404, "Start time should be less than finished time");   
          } else {
            updateDoc.startedAt = info.startedAt;
            if(shift.status == "draft") {
              updateDoc.status = "started";
            }
          }
        }
      }
      if(info.finishedAt) {
        var finishedTime = new Date(info.finishedAt).getTime();
        if(finishedTime != shift.finishedAt) {

          if(finishedTime <= shift.startedAt) {
            logger.error("Finish time should be greater than start time");
            throw new Meteor.Error(404, "Finish time should be greater than start time");    
          } else {
            updateDoc.finishedAt = info.finishedAt;
            if(shift.status != "finished") {
              updateDoc.status = "finished";
            }
          }
        }
      }
    }
    if(Object.keys(updateDoc).length > 0) {
      Shifts.update({'_id': id}, {$set: updateDoc});
      logger.info("Shift clock details updated", {"shiftId": id});
      return;
    }
  },

  publishRoster: function(week, shifts) {
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to publish shifts");
      throw new Meteor.Error(403, "User not permitted to publish shifts ");
    }
    if(shifts.length < 0) {
      logger.error("No shifts to be published");
      throw new Meteor.Error(404, "No shifts to be published");
    }
    Shifts.update({"_id": {$in: shifts}}, {$set: {"published": true, "publishedOn": Date.now()}}, {multi: true});
    logger.info("Weekly roster published", week);
  },

  claimShift: function(shiftId) {
    var userId = Meteor.userId();
    if(!userId) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    } 
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo) {
      logger.error("Shift has already been assigned");
      throw new Meteor.Error(404, "Shift has already been assigned");
    }
    if(userId) {
      Shifts.update({'_id': shiftId}, {$addToSet: {"claimedBy": userId}});
    } else {
      Shifts.update({'_id': shiftId}, {$set: {"claimedBy": [userId]}});
    }
    logger.info("Shift has been claimed ", {"user": userId, "shiftId": shiftId})
    return;
  },

  confirmClaim: function(shiftId, userId) {
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User does not have permission to confirm a shift claim");
      throw new Meteor.Error(403, "User does not have permission to confirm a shift claim");
    }
    var claimedBy = Meteor.users.findOne(userId);
    if(!claimedBy) {
      logger.error("Claimed user not found");
      throw new Meteor.Error(404, "Claimed user not found");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo) {
      logger.error("Shift has already been assigned");
      throw new Meteor.Error(404, "Shift has already been assigned");
    }
    var hasBeenAssigned = Shifts.findOne({"shiftDate": shift.shiftDate, "assignedTo": userId});
    if(hasBeenAssigned) {
      logger.error("User already has a shift on this day");
      throw new Meteor.Error(404, "User already has a shift on this day"); 
    }
    Shifts.update({"_id": shiftId}, {$set: {"assignedTo": userId}, $pull: {"claimedBy": userId}});
    logger.info("Shift claim confirmed ", {"shiftId": shiftId, "user": userId});
    return;
  },

  rejectClaim: function(shiftId, userId) {
    var user = Meteor.user();
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User does not have permission to confirm a shift claim");
      throw new Meteor.Error(403, "User does not have permission to confirm a shift claim");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo == userId) {
      logger.error("User has been assigned to this shift");
      throw new Meteor.Error(404, "User has been assigned to this shift");
    }
    if(shift.claimedBy.indexOf(userId) < 0) {
      logger.error("User has not claimed the shift");
      throw new Meteor.Error(404, "User has not claimed the shift");
    }
    Shifts.update({"_id": shiftId}, {$pull: {"claimedBy": userId}, $push: {"rejectedFor": userId}});
    logger.info("Shift claim rejected ", {"shiftId": shiftId, "user": userId});
    return;
  }
});