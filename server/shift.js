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
    console.log("Shift inserted");
    return Shifts.insert(doc);
  }
});