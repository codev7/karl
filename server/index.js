Meteor.methods({
  'createJob': function(info) {
    if(!info.name) {
      throw new Meteor.Error(404, "Name field not found");
    }
    if(!info.activeTime) {
      throw new Meteor.Error(404, "Time field not found");
    }
    var doc = {
      "name": info.name,
      "type": info.type,
      "createdOn": Date.now(),
      "details": info.details,
      "image": info.image,
      "portions": info.portions,
      "activeTime": info.time,
      "ingCost": info.ingCost,
      "shelfLife": info.shelfLife,
      "onshift": null,
      "assignedTo": [],
      "owner": null,
      "assignedBy": null
    }
    return Jobs.insert(doc);
  },

  'createShift': function(info) {
    if(!info.startTime) {
      throw new Meteor.Error(404, "Start time field not found");
    }
    if(!info.endTime) {
      throw new Meteor.Error(404, "End time field not found");
    }
    var doc = {
      "shiftDate": info.shiftDate,
      "createdOn": Date.now(),
      "startTime": info.startTime,
      "endTime": info.endTime,
      "assignedTo": [],
      "jobs": [],
      "owner": null,
      "assignedBy": null
    }
    return Shifts.insert(doc);
  }
});