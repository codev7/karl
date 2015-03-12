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
    var exist = JobItems.findOne({"name": info.name});
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    var activeTime = parseInt(info.activeTime) * 60; //seconds
    var shelfLife = parseInt(info.shelfLife); //days
    var doc = {
      "name": info.name,
      "type": info.type,
      "recipe": info.recipe,
      "portions": parseInt(info.portions),
      "activeTime": activeTime,
      "shelfLife": shelfLife,
      "createdOn": Date.now(),
      "createdBy": null, //add logged in users id
      "ingredients": []
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

    var ingredientIds = [];
    if(job.ingredients && job.ingredients.length > 0) {
      job.ingredients.forEach(function(doc) {
        ingredientIds.push(doc.id);
      });
    }

    var query = {
      $set: {},
      $push: {}
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
    var updateIngredients = [];
    if(info.ingredients && info.ingredients.length > 0) {
      if(info.ingredientIds && info.ingredientIds.length > 0) {
        info.ingredientIds.forEach(function(thisId) {
          var index = ingredientIds.indexOf(thisId);
          var point = info.ingredientIds.indexOf(thisId);
          if(index < 0) {
            updateIngredients.push(info.ingredients[point]);
          } else {
            var exist = JobItems.findOne(
              {"_id": id, "ingredients": {$elemMatch: {"id": thisId}}},
              {fields: {"ingredients": {$elemMatch: {"id": thisId}}}});
            if(exist) {
              var item = info.ingredients[point];
              if(exist.ingredients[0].id == item.id) {
                if(exist.ingredients[0].quantity != item.quantity) {
                  JobItems.update({'_id': id}, {$pull: {"ingredients": exist.ingredients[0]}});
                  updateIngredients.push(item);
                }
              }
            }
          }
        });
        
      }
    }
    if(Object.keys(updateDoc).length > 0) {
      query["$set"] = updateDoc;
    }
    if(Object.keys(updateIngredients).length > 0) {
      query['$push'] = {"ingredients": {$each: updateIngredients}};
    }
    logger.info("Job updated", {"JobId": id});
    return JobItems.update({'_id': id}, query);
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
  },

  removeIngredientsFromJob: function(id, ingredient) {
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
});