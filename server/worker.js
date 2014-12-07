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
      "availability": true,
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
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        throw new Meteor.Error(404, "Shift not found");
      }
      Shifts.update({_id: shiftId}, {$set: {"assignedTo": workerId}});
      Workers.update({_id: workerId}, {$set: {"availability": false}});// need algorithm
    } else {
      Workers.update({_id: workerId}, {$set: {"availability": true}});
    }
  },

  'deleteWorkerAssignedShift': function(workerId, shiftId) {
    if(workerId) {
      var worker = Workers.findOne(workerId);
      if(worker) {
        if(shiftId) {
          var shift = Shifts.findOne(shiftId);
          if(shift) {
            Shifts.update({_id: shiftId}, {$pull: {"assignedTo": workerId}});
            Workers.update({_id: workerId}, {$set: {"availability": true}, $pull: {"assignedShifts": shiftId}});
          }
        } else {
          Workers.update({_id: workerId}, {$set: {"availability": true}});
        }
      }
    } else {
      throw new Meteor.Error(404, "Worker id field not found");
    }
  }
});