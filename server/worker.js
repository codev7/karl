Meteor.methods({
  'createWorker': function(info) {
    if(!info.name) {
      throw new Meteor.Error(404, "Worker should have a name");
    }
    var doc = {
      "name": info.name,
      "type": info.type,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
      "hourlyWage": info.wage,
      "workLimit": null
    }
    return Workers.insert(doc);
  },

  'assignWorkerToShift': function(workerId, shiftId) {
    if(!workerId) {
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(workerId);
    if(!worker) {
      throw new Meteor.Error(404, "Worker not found");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.assignedTo) {
      throw new Meteor.Error(404, "Shift has already been assigned");
    }
    console.log("Shift been assigned to a new worker", shiftId, workerId);
    Shifts.update({_id: shiftId}, {$set: {"assignedTo": workerId}});
  },

  'deleteWorkerFromAssignedShift': function(workerId, shiftId) {
    if(!workerId) {
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(workerId);
    if(!worker) {
      throw new Meteor.Error(404, "Worker not found");
    }
    if(!shiftId) {
      throw new Meteor.Error(404, "Shift id field not found");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      throw new Meteor.Error(404, "Shift not found");
    }
    console.log("Shift assigned worker has been removed", shiftId, workerId);
    Shifts.update({_id: shiftId}, {$set: {"assignedTo": null}});
  }
});