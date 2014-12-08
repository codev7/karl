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

  'assignJobToShift': function(jobId, shiftId, jobStartTime) {
    console.log("--------------assgining job");
    if(!jobId) {
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      throw new Meteor.Error(404, "Job not found");
    }
    var jobDoc = {};
    jobDoc.job = jobId;
    if(job.onshift) {
      console.log("Job already on a shift, remove from shift", job.onshift, jobId);
      Shifts.update({_id: job.onshift}, {$pull: {"jobs": jobDoc}});
    }
    //if shift Id exists job move to that shift
    //if does not remove from the shift
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        throw new Meteor.Error(404, "Shift not found");
      }
      if(jobStartTime) {
        jobDoc.start = jobStartTime;
      }
      console.log("Job set to the shift", shiftId, jobId);
      Shifts.update({_id: shiftId}, {$addToSet: {"jobs": jobDoc}});
    } else {
      
    }
    Jobs.update({_id: jobId}, {$set: {"onshift": shiftId}});
  }
});