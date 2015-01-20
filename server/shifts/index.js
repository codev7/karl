Meteor.methods({
  'createShift': function(info) {
    if(!info.startTime) {
      logger.error("Start time not found");
      throw new Meteor.Error(404, "Start time not found");
    }
    if(!info.endTime) {
      logger.error("End time field not found");
      throw new Meteor.Error(404, "End time field not found");
    }
    var doc = {
      "startTime": info.startTime,
      "endTime": info.endTime,
      "shiftDate": info.shiftDate,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
      "assignedTo": null, //update
      "assignedBy": null, //update
      "jobs": []
    }
    var id = Shifts.insert(doc);
    logger.info("Shift inserted ", {"shiftId": id, "date": info.shiftDate});
    return;
  },

  'editShift': function(info) {
    if(!info._id) {
      logger.error("Shift Id not found")
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(info._id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    var updateDoc = {};
    if(info.startTime) {
      updateDoc.startTime = info.startTime;
    }
    if(info.endTime) {
      updateDoc.endTime = info.endTime;
    }
    if(shift.shiftDate != info.shiftDate) {
      if(shift.assignedTo || shift.jobs.length > 0) {
        logger.error("Can't change the date of an assigned shift ", {"id": info._id});
        throw new Meteor.Error(404, "Can't change the date of this shift");
      } else {
        updateDoc.shiftDate = info.shiftDate;
      }
    }
    if(Object.keys(updateDoc).length <= 0) {
      logger.error("Shift has nothing to be updated");
      throw new Meteor.Error(401, "Shift has nothing to be updated");
    }
    Shifts.update({'_id': info._id}, {$set: updateDoc});
    logger.info("Shift details updated", {"shiftId": info._id});
    return;
  },

  'deleteShift': function(id) {
    if(!id) {
      logger.error("Shift Id field not found");
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo || shift.jobs.length > 0) {
      logger.error("Can't delete a shift with assigned worker or jobs", {"id": id});
      throw new Meteor.Error(404, "Can't delete this shift");
    }
    Shifts.remove({'_id': id});
    logger.info("Shift deleted", {"shiftId": id});
    return;
  }
});