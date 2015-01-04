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
      "workLimit": info.limit,
      "resign": false
    }
    console.log("Inserted new worker");
    return Workers.insert(doc);
  },

  'editWorker': function(info) {
    if(!info._id) {
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(info._id);
    if(!worker) {
      throw new Meteor.Error(401, "Worker does not exist");
    }
    if(!info.name) {
      throw new Meteor.Error(404, "Worker should have a name");
    }
    var doc = {
      "name": info.name,
      "type": info.type,
      "hourlyWage": info.wage,
      "workLimit": info.limit
    }
    console.log("Edited worker", {"Worker Id": info._id});
    return Workers.update({'_id': info._id}, {$set: doc});
  },

  'deleteWorker': function(id) {
    if(!id) {
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(id);
    if(!worker) {
      throw new Meteor.Error(404, "Worker not found");
    }
    var alreadyAssigned = Shifts.find({"assignedTo": id}).count();
    if(alreadyAssigned > 0) {
      var todaysDate = new Date().toISOString().slice(0,10).replace(/-/g,"-");
      var assignedForFuture = Shifts.find({"shiftDate": {$gte: todaysDate}, "assignedTo": id});
      Shifts.update({"shiftDate": {$gte: todaysDate}, "assignedTo": id}, {$set: {"assignedTo": null}}, {multi: true});
      Workers.update({'_id': id}, {$set: {"resign": true}});
      console.log("Worker resigned - updated as resigned", {"workerId": id});
    } else {
      Workers.remove({'_id': id});
      console.log("Worker resigned - deleted", {"workerId": id});
    }
  },

  'assignWorkerToShift': function(workerId, shiftId) {
    if(!workerId) {
      throw new Meteor.Error(404, "Worker id field not found");
    }
    var worker = Workers.findOne(workerId);
    if(!worker) {
      throw new Meteor.Error(404, "Worker not found");
    }
    if(!shiftId) {
      throw new Meteor.Error(404, "Shift Id not found");
    }
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        throw new Meteor.Error(404, "Shift not found");
      }
      console.log("Shift been assigned to a worker", {"shiftId": shiftId, "workerId": workerId});
      Shifts.update({_id: shiftId}, {$set: {"assignedTo": workerId}});
    }
  },

  'removeWorkerFromAssignedShift': function(shiftId) {
    if(!shiftId) {
      throw new Meteor.Error(404, "Shift id field not found");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      throw new Meteor.Error(404, "Shift not found");
    }
    console.log("Shift assigned worker has been removed", {"shiftId": shiftId});
    Shifts.update({_id: shiftId}, {$set: {"assignedTo": null}});
  }
});