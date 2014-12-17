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

  'assignWorkerToShift': function(workerId, shiftId, options) {
    if(!workerId) {
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(workerId);
    if(!worker) {
      throw new Meteor.Error(404, "Worker not found");
    }
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        throw new Meteor.Error(404, "Shift not found");
      }
      if(shift.assignedTo) {
        throw new Meteor.Error(404, "Shift has already been assigned");
      }
      console.log("Shift been assigned to a new worker", shiftId, workerId);
      Shifts.update({_id: shiftId}, {$set: {"assignedTo": workerId}});
    } else {
      if(!options) {
        throw new Meteor.Error(404, "Options has not found");
      }
      if(!options.date) {
        throw new Meteor.Error(404, "Date is not found");
      }
      var assignedShift = Shifts.findOne({"shiftDate": options.date, "assignedTo": workerId});
      if(!assignedShift) {
        throw new Meteor.Error(404, "This worker has not been assigned to a shift");
      }
      Shifts.update({_id: assignedShift._id}, {$set: {"assignedTo": null}});
      console.log("Worker has been removed from shift", workerId);
    }
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