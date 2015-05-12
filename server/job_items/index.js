Meteor.methods({
  'createJobItem': function(info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(404, "User not permitted to create jobs");
    }
    var doc = {};
    if(!info.name) {
      logger.error("Name field not found");
      throw new Meteor.Error(404, "Name field not found");
    }
    doc.name = info.name;
    // var doc = {
    //   "name": info.name,
    //   "type": info.type,
    //   "recipe": info.recipe,
    //   "portions": parseInt(info.portions),
    //   "activeTime": activeTime,
    //   "shelfLife": shelfLife,
    //   "createdOn": Date.now(),
    //   "createdBy": userId,
    //   "ingredients": [],
    //   "wagePerHour": 0 
    // }
    
    var exist = JobItems.findOne({"name": info.name});
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }

    if(!info.activeTime) {
      logger.error("Time field not found");
      throw new Meteor.Error(404, "Time field not found");
    }
    doc.activeTime = parseInt(info.activeTime) * 60; //seconds
    
    var shelfLife = parseFloat(info.shelfLife); //days
    
    if(info.ingredients) {
      if(info.ingredients.length > 0) {
        var ingIds = [];
        info.ingredients.forEach(function(item) {
          if(ingIds.indexOf(item._id) < 0) {
            ingIds.push(item._id);
            doc.ingredients.push(item);
          }
        });
      }
    }
    if(info.wagePerHour) {
      doc.wagePerHour = info.wagePerHour;
    }
    var id = JobItems.insert(doc);
    logger.info("Job Item inserted", {"jobId": id, 'type': info.type});
    return id;
  },

  'editJobItem': function(id, info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to edit job item");
      throw new Meteor.Error(404, "User not permitted to edit job");
    }
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
    var query = {
      $set: {}
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
    if(info.activeTime || (info.activeTime >= 0)) {
      var activeTime = parseInt(info.activeTime) * 60;
      if(activeTime != job.activeTime) {
        updateDoc.activeTime = activeTime;
      }
    }
    if(info.wagePerHour || (info.wagePerHour >= 0)) {
      var wagePerHour = parseFloat(info.wagePerHour);
      if(wagePerHour != job.wagePerHour) {
        updateDoc.wagePerHour = wagePerHour;
      }
    }
    if(info.portions || (info.portions >= 0)) {
      var portions = parseFloat(info.portions);
      if(portions != job.portions) {
        updateDoc.portions = portions;
      }
    }
    if(info.shelfLife || (info.shelfLife >= 0)) {
      var shelfLife = parseFloat(info.shelfLife);
      if(shelfLife != job.shelfLife) {
        updateDoc.shelfLife = shelfLife;
      }
    }
    if(info.recipe) {
      if(info.recipe != job.recipe) {
        updateDoc.recipe = info.recipe;
      }
    }
    if(info.type) {
      if(info.type != job.type) {
        updateDoc.type = info.type;
      }
    }
    updateDoc.ingredients = [];
    if(info.ingredients) {
      if(info.ingredients.length > 0) {
        var ingIds = [];
        info.ingredients.forEach(function(item) {
          if(ingIds.indexOf(item._id) < 0) {
            ingIds.push(item._id);
            updateDoc.ingredients.push(item);
          }
        });
      }
    }
    if(Object.keys(updateDoc).length > 0) {
      updateDoc['editedOn'] = Date.now();
      updateDoc['editedBy'] = userId;
      query["$set"] = updateDoc;
      logger.info("Job Item updated", {"JobItemId": id});
      return JobItems.update({'_id': id}, query);
    }
  },

  'deleteJobItem': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to delete job item");
      throw new Meteor.Error(404, "User not permitted to delete job");
    }
    if(!id) {
      logger.error("JobItem id field not found");
      throw new Meteor.Error(404, "JobItem id field not found");
    }
    var job = JobItems.findOne(id);
    if(!job) {
      logger.error("Job Item not found", {"id": id});
      throw new Meteor.Error(404, "Job Item not found");
    }
    var existInMenuItems = MenuItems.findOne(
      {"jobItems": {$elemMatch: {"_id": id}}},
      {fields: {"jobItems": {$elemMatch: {"_id": id}}}}
    );
    if(existInMenuItems) {
      if(existInMenuItems.jobItems.length > 0) {
        logger.error("Item found in Menu Items, can't delete");
        throw new Meteor.Error(404, "Item is in use on menu items, cannot be deleted."); 
      }
    }
    logger.info("Job Item removed", {"id": id});
    JobItems.remove({'_id': id});
    return;
  },

  removeIngredientsFromJob: function(id, ingredient) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to delete job item");
      throw new Meteor.Error(404, "User not permitted to delete job");
    }
    if(!id) {
      logger.error("Job item should provide an id");
      throw new Meteor.Error(404, "Job item should provide an id");
    }
    var jobItem = JobItems.findOne(id);
    if(!jobItem) {
      logger.error("Job item does not exist");
      throw new Meteor.Error(404, "Job item does not exist");
    }
    if(jobItem.ingredients.length < 0) {
      logger.error("Ingredients does not exist for this job item");
      throw new Meteor.Error(404, "Ingredients does not exist for this job item");
    }
    var item = JobItems.findOne(
      {"_id": id, "ingredients": {$elemMatch: {"id": ingredient}}},
      {fields: {"ingredients": {$elemMatch: {"id": ingredient}}}}
    );
    var query = {
      $pull: {}
    };
    if(!item) {
      logger.error("Ingredients does not exist");
      throw new Meteor.Error(404, "Ingredients does not exist");
    }
    query['$pull']['ingredients'] = item.ingredients[0];
    JobItems.update({'_id': id}, query);
    logger.info("Ingredients removed from job item", id);
  },

  jobItemsCount: function() {
    return JobItems.find().count();
  }
});