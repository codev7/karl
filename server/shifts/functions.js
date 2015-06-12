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
    Shifts.update({"_id": id}, {$set: {"status": "finished", "finishedAt": new Date().getTime()}});
    logger.info("Shift ended", {"shiftId": id, "worker": userId});
  }
});