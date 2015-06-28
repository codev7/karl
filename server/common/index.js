Meteor.methods({
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
    return Categories.insert({"name": name});
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
    return Statuses.insert({"name": name.toLowerCase()});
  },
});
