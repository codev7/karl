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
      "createdBy": null, //add logged in users id
      "refDate": new Date().toISOString().slice(0,10).replace(/-/g,"-"),
      "details": info.details,
      "image": info.image,
      "portions": info.portions,
      "activeTime": info.time,
      "ingCost": info.ingCost,
      "shelfLife": info.shelfLife,
      "onshift": null,
      "status": 'draft',
      "assignedTo": null,
      "assignedBy": null,
    }
    return Jobs.insert(doc);
  },

  'assignJobToShift': function(jobId, shiftId) {
    if(jobId) {
      var job = Jobs.findOne(jobId);
      if(job) {
        if(job.onshift) {
          Shifts.update({_id: job.onshift}, {$pull: {"jobs": jobId}});
        }
        //if shift Id exists job move to that shift
        //if does not remove from the shift
        if(shiftId) {
          var shift = Shifts.findOne(shiftId);
          if(shift) {
            Shifts.update({_id: shiftId}, {$addToSet: {"jobs": jobId}});
            Jobs.update({_id: jobId}, {$set: {"onshift": shiftId}});
          }
        } else {
          Shifts.update({_id: shiftId}, {$pull: {"jobs": jobId}});
          Jobs.update({_id: jobId}, {$set: {"onshift": null}});
        } 
      } else {
        throw new Meteor.Error(404, "Job id field not found");
      } 
    }
  },
});