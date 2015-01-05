Meteor.methods({
  'createShift': function(info) {
    if(!info.startTime) {
      throw new Meteor.Error(404, "Start time field not found");
    }
    if(!info.endTime) {
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
    console.log("Shift inserted", {"startTime": info.startTime, "endTime": info.endTime});
    return Shifts.insert(doc);
  },

  'editShift': function(info) {
    if(!info._id) {
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    if(!info.startTime) {
      throw new Meteor.Error(404, "Start time field not found");
    }
    if(!info.endTime) {
      throw new Meteor.Error(404, "End time field not found");
    }
    var shift = Shifts.findOne(info._id);
    if(!shift) {
      throw new Meteor.Error(404, "Shift not found");
    }
    var doc = {
      "startTime": info.startTime,
      "endTime": info.endTime
    }
    if(shift.shiftDate != info.shiftDate) {
      if(shift.assignedTo || shift.jobs.length > 0) {
        throw new Meteor.Error(404, "You can't change the date of the shift.");
      } else {
        doc.shiftDate = info.shiftDate;
      }
    }
    Shifts.update({'_id': info._id}, {$set: doc});
    console.log("Shift updated", doc);
  },

  'deleteShift': function(id) {
    if(!id) {
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(id);
    if(!shift) {
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo || shift.jobs.length > 0) {
      throw new Meteor.Error(404, "You can't delete this shift.");
    } else {
      Shifts.remove({'_id': id});
      console.log("Shift deleted", {"shiftId": id});
    }
  }
});