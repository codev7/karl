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
        var startTime = new Date(info.startedAt).getTime();
        if(startTime != shift.startedAt) {
          if(startTime > shift.finishedAt) {
            logger.error("Start time should be less than finished time");
            throw new Meteor.Error(404, "Start time should be less than finished time");   
          } else {
            updateDoc.startedAt = info.startedAt;
          }
        }
      }
      if(info.finishedAt) {
        var finishedTime = new Date(info.finishedAt).getTime();
        if(finishedTime != shift.finishedAt) {
          if(finishedTime < shift.startedAt) {
            logger.error("Finish time should be greater than start time");
            throw new Meteor.Error(404, "Finish time should be greater than start time");    
          } else {
            updateDoc.finishedAt = info.finishedAt;
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
    //update shifts
    Shifts.update({"_id": {$in: shifts}, "assignedTo": {$ne: null}}, {$set: {"published": true}});
  },

  notifyRoster: function(to, title, text, startDate) {
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

    var emailText = "Hi " + to.name + ", <br>";
    emailText += "I've just published the roster for the week starting " + startDate + ".<br><br>";
    emailText += "Here's your shifts";
    emailText += text;
    emailText += "<br>If there are any problems with the shifts, please let me know.";
    emailText += "<br>Thanks.<br>";
    emailText += user.username;
    //email
    Email.send({
      "to": to.email,
      "from": user.emails[0].address,
      "subject": "[Hero Chef] " + title,
      "html": emailText
    });
    logger.info("Email sent for weekly roster", to._id);
    //notification
    var notifi = {
      "type": "roster",
      "title": title,
      "read": false,
      "text": text,
      "to": to._id,
      "createdOn": new Date().getTime(),
      "createdBy": Meteor.userId()
    }
    Notifications.insert(notifi);
    logger.info("Notification sent for weekly roster", to._id);
    return;
  }
});