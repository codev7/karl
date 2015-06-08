Meteor.methods({
  'createNewJob': function(info) {
    if(!info.ref) {
      logger.error("Job field not found");
      throw new Meteor.Error(404, "Job field not found");
    }
    if(!info.type) {
      logger.error("Job type field not found");
      throw new Meteor.Error(404, "Job type field not found");
    }
    if((info.type == "Prep") && (!info.portions)) {
      logger.error("No of portions not found for prep type job");
      throw new Meteor.Error(404, "No of portions not found for prep type job");
    }
    if((info.type == "Recurring") && (!info.activeTime)) {
      logger.error("Active time not found for recurring type job");
      throw new Meteor.Error(404, "Active time not found for recurring type job");
    }
    var job = JobItems.findOne(info.ref);
    if(!job) {
      logger.error("Job not found");
      throw new Meteor.Error(404, "Job not found");
    }

    var doc = {
      "ref": job._id,
      "type": job.type,
      "status": 'draft',
      "options": [],
      "onshift": null,
      "assignedTo": null,
      "createdOn": Date.now(),
      "createdBy": Meteor.userId()
    }
    doc.name = job.type + " " + job.name;
    if(job.type == "Prep") {
      doc.portions = info.portions;
      var time = parseInt((job.activeTime/job.portions) * info.portions);
      if(time == time) {
        doc.activeTime = time;
      } else {
        logger.error("Active time not valid");
        throw new Meteor.Error(404, "Active time not valid");
      }
    } else {
      doc.activeTime = info.activeTime;
      doc.section = job.section;
      doc.startAt = job.repeatAt;
    }
    var id = Jobs.insert(doc);
    logger.info("Job inserted", {"jobId": id});
    return id;
  },

  'editJob': function(id, editFields) {
    if(!id) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(id);
    if(!job) {
      logger.error("Job does not exist", {"jobId": id});
      throw new Meteor.Error(404, "Job does not exist");
    }
    if(!editFields) {
      logger.error("No editing fields found");
      throw new Meteor.Error(404, "No editing fields found");
    }
    if(editFields.name == "") {
      logger.error("Name field null");
      throw new Meteor.Error(404, "You can't add empty name job");
    }
    if(editFields.activeTime == "") {
      logger.error("Active time field null");
      throw new Meteor.Error(404, "You can't add empty active time");
    }
    logger.info("Job updated", {"JobId": id});
    return Jobs.update({'_id': id}, {$set: editFields});
  },

  'deleteJob': function(id, shiftId) {
    if(!id) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(id);
    if(!job) {
      logger.error("Job not found", {"jobId": id});
      throw new Meteor.Error(404, "Job not found");
    }
    if(job.status == "draft") {
      logger.info("Job removed", {"jobId": id});
      Jobs.remove({'_id': id});
    } else {
      if(job.status == "assigned") {
        if(shiftId) {
          var shift = Shifts.findOne(shiftId);
          if(shift) {
            Shifts.update({'_id': shiftId}, {$pull: {"jobs": id}});
            logger.info("Removed job from shift");
          }
        }
        logger.info("Job set back to draft state - not deleted", {"jobId": id});
        Jobs.update({'_id': id}, {$set: {"status": "draft", "onshift": null}});
      } else {
        logger.error("Job is in active stage, can't delete", {"JobId": id, "State": job.status});
        throw new Meteor.Error(404, "Job in '" + job.status + "' status cannot be deleted");
      }
    }
  },

  'addJobType': function(type) {
    if(!type) {
      logger.error("Job type field not found");
      throw new Meteor.Error("Job type field not found");
    }
    var existingtype = JobTypes.findOne({'type': type});
    if(existingtype) {
      logger.error("Existing job type");
      throw new Meteor.Error("Exsiting job type");
    } 
    logger.info("New job type inserted ", {"type": type});
    JobTypes.insert({'type': type});
  },

  'changeJobStatus': function(jobId, state) {
    if(!jobId) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    if(!state) {
      logger.error("Update State field not found");
      throw new Meteor.Error(404, "Update State field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      logger.error("Job not found");
      throw new Meteor.Error(404, "Job not found");
    }
    if(!job.onshift) {
      logger.error("Assign job to a shift before changing status");
      throw new Meteor.Error(404, "Assign job to a shift before change status");
    }
    var updateStatus = null;
    var currentStatus = job.status;
    var options = job.options;
    //start, state to started
    if(currentStatus == "assigned") {
      if(state == "start") {
        updateStatus = "started";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change");        
      }
    } else if(currentStatus == "started") {
      if(state == "pause") {
        updateStatus = "paused";
      } else if(state == "cooking") {
        updateStatus = "cooking";
      } else if(state == "finish") {
        updateStatus = "finished";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change"); 
      }
    } else if(currentStatus == "cooking") {
      if(state == "pause") {
        updateStatus = "paused";
      } else if(state == "finish") {
        updateStatus = "finished";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change"); 
      }
    } else if(currentStatus == "paused") {
      if(state == "start") {
        updateStatus = "started";
      } else if(state == "cooking") {
        updateStatus = "cooking";
      } else if(state == "finish") {
        updateStatus = "finished";
      } else {
        logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
        throw new Meteor.Error(404, "Invalid state change"); 
      }
    } else {
      logger.error("Invalid state change ", {"currnet": currentStatus, "changeTo": state});
      throw new Meteor.Error(404, "Invalid state change");
    }

    options[updateStatus] = new Date();

    logger.info("Job status updated", {"jobId": jobId, "status": updateStatus, "options": options});
    Jobs.update({"_id": jobId}, {$set: {"status": updateStatus, "options": options}});
    //if finished, add portions to inventory
    if(updateStatus == "finished") {
      logger.info("Inventory update ", {"jobId": jobId, "portions": job.portions});
      //add inventory update here (Not designed yet)
    }
  }  
});