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
    var finishAt = new Date().getTime();
    var activeTime = finishAt - shift.startedAt;
    Shifts.update({"_id": id}, {$set: {"status": "finished", "finishedAt": finishAt, "activeHours": activeTime}});
    logger.info("Shift ended", {"shiftId": id, "worker": user._id});
  },

  'editClock': function(id, info) {
    if(!id) {
      logger.error("Shift id not found");
      throw new Meteor.Error(404, "Shift id not found");
    }
    var userId = Meteor.userId();
    if(!userId) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var shift = Shifts.findOne({"_id": id});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.status == "started") {
      logger.error("Shift has started. Can't change time till it's finished");
      throw new Meteor.Error(404, "Shift has started. Can't change time till it's finished");
    }
    var updateDoc = {};
    if(info.startDraft) {
      if(!shift.startedAt) {
        updateDoc.startedAt = info.startDraft;
        updateDoc.finishedAt = info.startDraft + 1000*60*60;
        updateDoc.status = "finished";
      }
    } else {
      if(info.startedAt) {
        if(info.startedAt != shift.startedAt) {
          updateDoc.startedAt = info.startedAt;
        }
      }
      if(info.finishedAt) {
        if(info.finishedAt != shift.finishedAt) {
          updateDoc.finishedAt = info.finishedAt;
        }
      }
    }
    Shifts.update({'_id': id}, {$set: updateDoc});
    logger.info("Shift clock details updated", {"shiftId": id});
    return;
  }
});