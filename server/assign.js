Meteor.methods({
  'assignJob': function(jobId, shiftId, startAt) {
    if(!jobId) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      logger.error("Job does not exist", {"jobId": jobId});
      throw new Meteor.Error(404, "Job does not exist");
    }
    if(!(job.status === "draft" || job.status === "assigned")) {
      logger.error("Cannot assign a job in this status ", {"jobId": jobId, "status": job.status});
      throw new Meteor.Error(404, "Cannot assign a job in this status");
    }
    var updateDoc = {};
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    if(job.onshift) {
      var job_on_shift = Shifts.findOne(job.onshift);
      if(!job_on_shift) {
        logger.error("Shift not found");
        throw new Meteor.Error(404, "Shift not found");
      }
      // if(new Date(job_on_shift.shiftDate) <= yesterday) {
      //   logger.error("Shift cannot accept new jobs", {"shiftId": job.onshift});
      //   throw new Meteor.Error(404, "This shift cannot accept new jobs");
      // }
      // if(job.onshift != sh)
      // //removing from current onshift
      // Shifts.update({"_id": job.onshift}, {$pull: {"jobs": jobId}});
      // logger.info("Removed job from current shift");
    } 
    if(shiftId) { //assign job
      var new_shift = Shifts.findOne(shiftId);
      if(!new_shift) {
        logger.error("Shift not found");
        throw new Meteor.Error(404, "Shift not found");
      }
      // if(new Date(new_shift.shiftDate) <= yesterday) {
      //   logger.error("Shift cannot accept new jobs", {"shiftId": shiftId});
      //   throw new Meteor.Error(404, "This shift cannot accept new jobs");
      // }
      if(shiftId != job.onshift) {
        updateDoc.onshift = shiftId;
      }
      updateDoc.status = "assigned";
      updateDoc.options = {"assigned": new Date().getTime()}
      if(startAt) {
        var newDate = new Date(new_shift.shiftDate);

        var startAtDate = new Date(startAt);
        var starting = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), startAtDate.getHours(), startAtDate.getMinutes());

        updateDoc.startAt = new Date(starting).getTime();
      }

      //updating new shift
      Shifts.update({"_id": shiftId}, {$addToSet: {"jobs": jobId}});
      logger.info("Updated shift with assigned job", {"id": shiftId});
    } else { // remove assigned job
      if(job.status == "assigned") {
        updateDoc.onshift = null;
        updateDoc.status = "draft";
        updateDoc.options = {"draft": new Date()};
      } else {
        logger.error("Can not remove un-assigned job");
        throw new Meteor.Error(404, "Removing an un-assigned job");
      }
    }
    //updating job
    Jobs.update({"_id": jobId}, {$set: updateDoc});
    logger.info("Updated job as assigned", {"id": jobId});
  },

  'assignWorker': function(workerId, shiftId) {
    if(!shiftId) {
      logger.error("Shift Id not found");
      throw new Meteor.Error(404, "Shift Id not found");
    }
    var shift = Shifts.findOne(shiftId);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    if(shift.status != "draft") {
      logger.error("Can't change shift parameters, as shift is active");
      throw new Meteor.Error(404, "Can't change shift parameters, as shift is active");
    }
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(shift.shiftDate) <= yesterday) {
    //   logger.error("Shift date passed");
    //   throw new Meteor.Error(404, "Shift cannot be assigned, date is passed");
    // }
    var updateDoc = {
      "assignedTo": null
    };
    if(workerId) {
      var existInShift = Shifts.findOne({"shiftDate": shift.shiftDate, "assignedTo": workerId});
      if(existInShift) {
        logger.error("User already exist in a shift", {"date": shift.shiftDate});
        throw new Meteor.Error(404, "Worker has already been assigned to a shift");
      }
      var worker = Meteor.users.findOne(workerId);
      if(!worker) {
        logger.error("Worker not found");
        throw new Meteor.Error(404, "Worker not found");
      }
      updateDoc.assignedTo = workerId;
      Shifts.update({_id: shiftId}, {$set: updateDoc});
      logger.info("Worker assigned to shift", {"shiftId": shiftId, "workerId": workerId});
    } else {
      Shifts.update({_id: shiftId}, {$set: {"assignedTo": null}});
      logger.info("Worker removed from shift", {"shiftId": shiftId, "workerId": shift.assignedTo});
    }
    return;
  } 
});