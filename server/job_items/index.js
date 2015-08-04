Meteor.methods({
  'createJobItem': function(info) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
    }
    if(!info.name) {
      logger.error("Name field not found");
      throw new Meteor.Error(404, "Name field not found");
    }
    if(!info.type) {
      logger.error("Type field not found");
      throw new Meteor.Error(404, "Type field not found");
    }
    var exist = JobItems.findOne({"name": info.name});
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    var doc = {};
    doc.name = info.name;
    if(!info.activeTime) {
      logger.error("Time field not found");
      throw new Meteor.Error(404, "Time field not found");
    }
    var activeTime = parseInt(info.activeTime) * 60; //seconds
    doc.activeTime = activeTime;
    doc.status = "active";
    var type = JobTypes.findOne(info.type);
    if(!type) {
      logger.error("Type not found");
      throw new Meteor.Error(404, "Type not found");
    }
    doc.type = info.type;

    if(info.wagePerHour) {
      doc.wagePerHour = info.wagePerHour;
    }

    if(type.name == "Prep") {
      if(info.shelfLife == info.shelfLife) {
        var shelfLife = parseFloat(info.shelfLife); //days
        doc.shelfLife = shelfLife;
      }
      doc.recipe = info.recipe;
      if(info.portions == info.portions) {
        doc.portions =  parseInt(info.portions);
      }
      doc.ingredients = [];
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
    } else if(type.name == "Recurring") {
      doc.repeatAt = info.repeatAt;
      doc.description = info.description;
      doc.frequency = info.frequency;
      doc.startsOn = new Date(info.startsOn).getTime();
      doc.endsOn = info.endsOn;
      if(info.frequency == "Weekly") {
        doc.repeatOn = info.repeatOn;
      }
      doc.section = info.section;
      doc.checklist = info.checklist;
    }
    
    doc.createdOn = Date.now();
    doc.createdBy = user._id;
    var id = JobItems.insert(doc);
    logger.info("Job Item inserted", {"jobId": id, 'type': type.name});
    return id;
  },
  
  'editJobItem': function(id, info) {

    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create job items");
      throw new Meteor.Error(403, "User not permitted to create jobs");
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
    var removeDoc = {}
    if(info.name) {
      if(info.name.trim() == "") {
        logger.error("Name field null");
        throw new Meteor.Error(404, "You can't add empty name for job");
      } else {
        if(info.name != job.name) {
          updateDoc.name = info.name;
        }
      }
    }

    if(info.type) {
      if(info.type != job.type) {
        updateDoc.type = info.type;
      }
    }

    if(info.activeTime && (info.activeTime == info.activeTime)) {
      if(info.activeTime > 0) {
        var activeTime = parseInt(info.activeTime) * 60;
        if(activeTime != job.activeTime) {
          updateDoc.activeTime = activeTime;
        }
      }
    }

    if(info.wagePerHour || (info.wagePerHour == info.wagePerHour)) {
      if(info.wagePerHour >= 0) {
        var wagePerHour = parseFloat(info.wagePerHour);
        if(wagePerHour != job.wagePerHour) {
          updateDoc.wagePerHour = wagePerHour;
        }
      }
    }
    if(info.type == "Prep") {
      if((info.shelfLife == info.shelfLife) && info.shelfLife >= 0) {
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

      if((info.portions == info.portions) && info.portions >= 0) {
        var portions = parseFloat(info.portions);
        if(portions != job.portions) {
          updateDoc.portions = portions;
        }
      }

      updateDoc.ingredients = [];
      if(info.ingredients && (info.ingredients.length > 0)) {
        var ingIds = [];
        info.ingredients.forEach(function(item) {
          if(ingIds.indexOf(item._id) < 0) {
            ingIds.push(item._id);
            updateDoc.ingredients.push(item);
          }
        });
      }

      removeDoc.repeatAt = "";
      removeDoc.repeatOn = "";
      removeDoc.frequency = "";
      removeDoc.endsOn = "";
      removeDoc.startsOn = "";
      removeDoc.section = "";
      removeDoc.description = "";
    } else if(info.type == "Recurring") {
      if(info.repeatAt) {
        if(info.repeatAt != job.repeatAt) {
          updateDoc.repeatAt = info.repeatAt;
        }
      }
      if(info.description) {
        if(info.description != job.description) {
          updateDoc.description = info.description;
        }
      }
      if(info.frequency) {
        if(info.frequency != job.frequency) {
          updateDoc.frequency = info.frequency;
        }
        if(info.frequency == "Weekly") {
          updateDoc.repeatOn = info.repeatOn;
        }
      }
      if(info.startsOn) {
        if(info.startsOn != new Date(job.startsOn).getTime()) {
          updateDoc.startsOn = new Date(info.startsOn).getTime();
        }
      }
      if(info.endsOn) {
        updateDoc.endsOn = info.endsOn;
      }
      if(info.section) {
        if(info.section != job.section) {
          updateDoc.section = info.section;
        }
      }
      if(info.checklist) {
        updateDoc.checklist = info.checklist;
      }
      removeDoc.shelfLife = "";
      removeDoc.portions = "";
      removeDoc.ingredients = "";
      removeDoc.recipe = "";
    }

    if(Object.keys(updateDoc).length > 0) {
      updateDoc['editedOn'] = Date.now();
      updateDoc['editedBy'] = user._id;
      query["$set"] = updateDoc;
      if(Object.keys(removeDoc).length > 0) {
        query["$unset"] = removeDoc;
      }
      logger.info("Job Item updated", {"JobItemId": id});
      return JobItems.update({'_id': id}, query);
    }
  },

  'deleteJobItem': function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to delete job item");
      throw new Meteor.Error(403, "User not permitted to delete job");
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
        logger.error("Item found in Menu Items, can't delete. Archiving job item");
        throw new Meteor.Error(404, "Delete not permitted");
        // return JobItems.update({'_id': id}, {$set: {"status": 'archive'}})
      }
    }
    logger.info("Job Item removed", {"id": id});
    JobItems.remove({'_id': id});
    return;
  },

  'addIngredientsToJob': function(id, ingredient, quantity) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to update ingredients of job item");
      throw new Meteor.Error(403, "User not permitted to update ingredients of job");
    }
    if(!id) {
      logger.error("Job item should provide an id");
      throw new Meteor.Error(404, "Job item should provide an id");
    }
    var jobItem = JobItems.findOne(
      {"_id": id, "ingredients": {$elemMatch: {"_id": ingredient}}}
    );
    if(!jobItem) {
      logger.error("Job item or ingredient does not exist");
      throw new Meteor.Error(404, "Job item or ingredient does not exist");
    }
    
    var query = {
      $addToSet: {}
    };
    query['$addToSet']['ingredients'] = {"_id": ingredient, "quantity": quantity};
    JobItems.update({'_id': id}, query);
    logger.info("Ingredients added to job item", id);
  },

  removeIngredientsFromJob: function(id, ingredient) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to update ingredients of job item");
      throw new Meteor.Error(403, "User not permitted to update ingredients of job");
    }
    if(!id) {
      logger.error("Job item should provide an id");
      throw new Meteor.Error(404, "Job item should provide an id");
    }
    var jobItem = JobItems.findOne(
      {"_id": id, "ingredients": {$elemMatch: {"_id": ingredient}}},
      {fields: {"ingredients.$._id": ingredient}}
    );
    if(!jobItem) {
      logger.error("Job item or ingredient does not exist");
      throw new Meteor.Error(404, "Job item or ingredient does not exist");
    }
    if(jobItem.ingredients.length > 0) {
      var query = {
        $pull: {
          "ingredients": jobItem.ingredients[0]
        }
      };   
    }
    logger.info("Ingredients removed from job item", id);
    return JobItems.update({'_id': id}, query);
  },

  jobItemsCount: function() {
    return JobItems.find().count();
  },

  duplicateJobItem: function(id) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(403, "User not permitted to add jobs");
    }
    var exist = JobItems.findOne(id);
    if(!exist) {
      logger.error('Job should exist to be duplicated');
      throw new Meteor.Error(404, "Job should exist to be duplicated");
    }
    var filter = new RegExp(exist.name, 'i');
    var count = JobItems.find({"name": filter}).count();
    
    var result = delete exist['_id'];
    if(result) {
      var duplicate = exist;
      duplicate.name = exist.name + " - copy " + count;
      duplicate.createdBy = user._id;
      duplicate.createdOn = Date.now();

      var newId = JobItems.insert(duplicate);
      logger.info("Duplicate job item added ", {"original": id, "duplicate": newId});
      return newId;
    }
  }
});