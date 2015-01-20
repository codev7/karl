Meteor.methods({
  'assignJobToShift': function(jobId, shiftId) {
    if(!jobId) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      logger.error("Job does not exist", {"jobId": jobId});
      throw new Meteor.Error(404, "Job does not exist");
    }
    if(job.onshift) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        logger.error("Shift not found");
        throw new Meteor.Error(404, "Shift not found");
      }
      if(job.status === 'assigned') {
        logger.info("Job already on a shift, remove from shift", {"onshift": job.onshift, "jobId": jobId});
        Shifts.update({"_id": job.onshift}, {$pull: {"jobs": jobId}});
      } else {
        logger.error("Job on this state, cannot be moved " + job.status);
        throw new Meteor.Error(404, "Job on this state, cannot be moved: " + job.status);
      }
    }
    var status = null;
    //if shift Id exists job move to that shift
    //if does not remove from the shift
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(!shift) {
        logger.error("Shift not found");
        throw new Meteor.Error(404, "Shift not found");
      }
      logger.info("Job added to the new shift", {"shiftId": shiftId, "jobId": jobId});
      Shifts.update({"_id": shiftId}, {$addToSet: {"jobs": jobId}});
      status = "assigned";
    } else {
      status = "draft";
    }
    var optionsDoc = {
      status: new Date()
    }
    logger.info("Job status and onshift updated ", {"JobId": jobId, "status": status, "onshift": shiftId});
    Jobs.update({"_id": jobId}, {$set: {"onshift": shiftId, "status": status}, $addToSet: {'options': optionsDoc}});
  },

  'assignShift': function(workerId, shiftId) {
    if(!shiftId) {
      logger.error("Shift Id not found");
      throw new Meteor.Error(404, "Shift Id not found");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      throw new Meteor.Error(404, "Shift not found");
    }
    var updateDoc = {
      "assignedTo": null
    };
    if(workerId) {
      var worker = Workers.findOne(workerId);
      if(!worker) {
        logger.error("Worker not found");
        throw new Meteor.Error(404, "Worker not found");
      }
      updateDoc.assignedTo = workerId;
    }
    Shifts.update({_id: shiftId}, {$set: updateDoc});
    logger.info("Shift has been assigned to a worker", {"shiftId": shiftId, "workerId": workerId});
  }
});