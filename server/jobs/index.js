Meteor.methods({
  generateJobs: function(menuInfo, date) {
    console.log(menuInfo, date);
    var jobIds = [];
    if(Object.keys(menuInfo).length > 0) {
      menuInfo.forEach(function(menu) {
        var menuItem = MenuItems.findOne(menu.id);

        if(Object.keys(menuItem.jobItems).length > 0) { 
          menuItem.jobItems.forEach(function(jobItem) {
            var item = JobItems.findOne(jobItem.id);
            var quantity = jobItem.quantity * menu.quantity;
            var timeTaken = (item.activeTime/item.portions) * quantity;
            var today = new Date(date).toISOString().slice(0,10).replace(/-/g,"-");
            var todayJobExist = Jobs.findOne({"name": item.name, "createdOn": today});
            if(todayJobExist) {
              var newActiveTime = todayJobExist.activeTime + timeTaken;
              var newPortions = todayJobExist.portions + quantity;
              Jobs.update({"_id": todayJobExist._id}, {$set: {"activeTime": newActiveTime, "portions": newPortions}});
            } else {
              var info = {
                "name": item.name,
                "type": item.type,
                "status": "draft",
                "options": [],
                "onshift": null,
                "portions": quantity,
                "activeTime": timeTaken,
                "assignedTo": null,
                "shelfLife": item.shelfLife,
                "createdOn": today,
                "createdBy": null, //add logged in users id,
                "ingredients": [],
                "totalIngredientCost": 0
              }
              var jobId = Jobs.insert(info);
              if(jobId) {
                jobIds.push(jobId);
              }
            }
          });
        }
      });
    }
    return jobIds;
  },




  'createJob': function(info) {
    if(!info.name) {
      logger.error("Name field not found");
      throw new Meteor.Error(404, "Name field not found");
    }
    if(!info.activeTime) {
      logger.error("Time field not found");
      throw new Meteor.Error(404, "Time field not found");
    }
    // if(!info.ingredients) {
    //   logger.error("Ingredients not found");
    //   throw new Meteor.Error(404, "Ingredients not found");
    // }
    var ingCost = 0;
    // info.ingredients.forEach(function(ingredient) {  
    //   ingCost += ingredient.cost
    // });
    var doc = {
      "name": info.name,
      "type": info.type,
      "status": 'draft',
      "options": [],
      "onshift": null,
      "ingredients": info.ingredients,
      "ingCost": ingCost,
      "portions": info.portions,
      "activeTime": info.activeTime,
      "shelfLife": info.shelfLife,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
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

  'deleteJob': function(id) {
    if(!id) {
      logger.error("Job id field not found");
      throw new Meteor.Error(404, "Job id field not found");
    }
    var job = Jobs.findOne(jobId);
    if(!job) {
      logger.error("Job not found", {"jobId": id});
      throw new Meteor.Error(404, "Job not found");
    }
    if(job.status == "draft") {
      logger.info("Job removed", {"jobId": id});
      Jobs.remove({'_id': jobId});
    } else {
      if(job.status == "assigned") {
        logger.info("Job set back to draft state - not deleted", {"jobId": id});
        Jobs.update({'_id': jobId}, {$set: {"status": "draft", "onshift": null}});
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