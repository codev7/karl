Meteor.methods({
  'createJobItem': function(info) {
    if(!info.name) {
      logger.error("Name field not found");
      throw new Meteor.Error(404, "Name field not found");
    }
    if(!info.activeTime) {
      logger.error("Time field not found");
      throw new Meteor.Error(404, "Time field not found");
    }
    var id = info.name.trim().toLowerCase().replace(/ /g, "_");
    var exist = JobItems.findOne(id);
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    var activeTime = parseInt(info.activeTime) * 60; //seconds
    var shelfLife = parseInt(info.shelfLife); //days
    var doc = {
      "_id": id,
      "name": info.name,
      "type": info.type,
      "recipe": info.recipe,
      "portions": parseInt(info.portions),
      "activeTime": activeTime,
      "shelfLife": shelfLife,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
    }
    if(info.ingredients) {
      if(info.ingredients.length > 0) {
        doc.ingredients = info.ingredients;
      }
    }
    var id = JobItems.insert(doc);
    logger.info("Job Item inserted", {"jobId": id, 'type': info.type});
    return id;
  },

  'editJobItem': function(id, info) {
    if(!id) {
      logger.error("JobItem id field not found");
      throw new Meteor.Error(404, "JobItem id field not found");
    }
    var job = JobItems.findOne(id);
    if(!job) {
      logger.error("Job item does not exist", {"jobId": id});
      throw new Meteor.Error(404, "Job item does not exist");
    }
    if(Object.keys(info).length < 0) {
      logger.error("No editing fields found");
      throw new Meteor.Error(404, "No editing fields found");
    }
    var updateDoc = {};
    if(info.name) {
      if(info.name.trim() == "") {
        logger.error("Name field null");
        throw new Meteor.Error(404, "You can't add empty name job");
      } else {
        if(info.name != job.name) {
          updateDoc.name = info.name;
        }
      }
    }
    if(info.activeTime) {
      var activeTime = parseInt(info.activeTime) * 60;
      if(activeTime != job.activeTime) {
        updateDoc.activeTime = activeTime;
      }
    }
    if(info.portions) {
      var portions = parseFloat(info.portions);
      if(portions != job.portions) {
        updateDoc.portions = portions;
      }
    }
    if(info.shelfLife) {
      var shelfLife = parseInt(info.shelfLife);
      if(shelfLife != job.shelfLife) {
        updateDoc.shelfLife = shelfLife;
      }
    }
    if(info.recipe) {
      if(info.recipe != job.recipe) {
        updateDoc.recipe = info.recipe;
      }
    }
    if(Object.keys(updateDoc).length > 0) {
      logger.info("Job updated", {"JobId": id});
      return JobItems.update({'_id': id}, {$set: updateDoc});
    }
  },

  'deleteJobItem': function(id) {
    if(!id) {
      logger.error("JobItem id field not found");
      throw new Meteor.Error(404, "JobItem id field not found");
    }
    var job = JobItems.findOne(id);
    if(!job) {
      logger.error("Job Item not found", {"id": id});
      throw new Meteor.Error(404, "Job Item not found");
    }
    logger.info("Job Item removed", {"id": id});
    JobItems.remove({'_id': id});
  }
});