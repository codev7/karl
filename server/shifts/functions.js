Meteor.methods({
  'clockIn': function(id) {
    if(!id) {
      logger.error("Shift id not found");
      throw new Meteor.Error(404, "Shift id not found");
    }
    var userId = Meteor.userId();
    if(!userId) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var shift = Shifts.findOne({"_id": id, "assignedTo": Meteor.userId()});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    Shifts.update({"_id": id}, {$set: {"status": "started", "startedAt": new Date().getTime()}});
    logger.info("Shift started", {"shiftId": id, "worker": userId});
  },

  'clockOut': function(id) {
    if(!id) {
      logger.error("Shift id not found");
      throw new Meteor.Error(404, "Shift id not found");
    }
    var userId = Meteor.userId();
    if(!userId) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var shift = Shifts.findOne({"_id": id, "assignedTo": Meteor.userId(), "status": "started"});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    var finishAt = new Date().getTime();
    var activeTime = finishAt - shift.startedAt;
    Shifts.update({"_id": id}, {$set: {"status": "finished", "finishedAt": finishAt, "activeHours": activeTime}});
    logger.info("Shift ended", {"shiftId": id, "worker": userId});
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
    var shift = Shifts.findOne({"_id": id, "status": "finished"});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    var updateDoc = {};
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
    Shifts.update({'_id': id}, {$set: updateDoc});
    logger.info("Shift clock details updated", {"shiftId": id});
    return;
  }
});