Meteor.methods({
  'createJobType': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Job type should have a name");
      return new Meteor.Error(404, "Job type should have a name");
    }
    var exist = JobTypes.findOne({"name": name});
    if(exist) {
      logger.error('Job type should be unique', exist);
      throw new Meteor.Error(404, "Job type should be unique");
    }
    logger.info("New job type created")
    return JobTypes.insert({"name": name});
  },

  'createCategory': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Category should have a name");
      return new Meteor.Error(404, "Category should have a name");
    }
    var exist = Categories.findOne({"name": name});
    if(exist) {
      logger.error('Category name should be unique', exist);
      throw new Meteor.Error(404, "Category name should be unique");
    }
    var id = Categories.insert({"name": name});
    logger.info("New Category created", id);
    return id;
  },

  'createStatus': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Status should have a name");
      return new Meteor.Error(404, "Status should have a name");
    }
    var exist = Statuses.findOne({"name": name});
    if(exist) {
      logger.error('Status name should be unique', exist);
      throw new Meteor.Error(404, "Status name should be unique");
    }
    var id = Statuses.insert({"name": name.toLowerCase()});
    logger.info("New Status created", id);
    return id;
  },

  'createSection': function(name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!name) {
      logger.error("Section should have a name");
      return new Meteor.Error(404, "Section should have a name");
    }
    var exist = Sections.findOne({"name": name});
    if(exist) {
      logger.error('Section name should be unique', exist);
      throw new Meteor.Error(404, "Section name should be unique");
    }
    var id = Sections.insert({"name": name});
    logger.info("New section added", id);
    return;
  },

  'deleteSection': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
   
    var exist = Sections.findOne(id);
    if(!exist) {
      logger.error('Section does not exist');
      throw new Meteor.Error(404, "Section does not exist");
    }
    var usedInJobItems = JobItems.findOne({"section": exist.name});
    if(usedInJobItems) {
      logger.error('Section exist in job items');
      throw new Meteor.Error(404, "Section exist in job items");
    }
    var usedInShifts = Shifts.findOne({"section": exist.name});
    if(usedInShifts) {
      logger.error('Section exist in shifts');
      throw new Meteor.Error(404, "Section exist in shifts");
    }
    Sections.remove(id);
    logger.info("Section removed", id);
    return;
  },

  'editSection': function(id, name) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    var exist = Sections.findOne(id);
    if(!exist) {
      logger.error('Section does not exist');
      throw new Meteor.Error(404, "Section does not exist");
    }
    Sections.update({"_id": id}, {$set: {"name": name}});
    logger.info("Section name updated", id);
    return;
  }
});
