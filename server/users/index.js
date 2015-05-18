Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  if(options.profile) {
    if(!options.profile.email) {
      user.emails = [{ "address": null}];
      user.emails[0].address = user.services.google.email;
      user.username = options.profile.name;
    }
  }     
  if(!user.profile.name) {
    user.profile.name = user.username;
  }
  
  // if this is the first user ever, make them an admin
  if(!Meteor.users.find().count()) {
    user.isAdmin = true;
  } else {
    user.isWorker = true;
  }
  return user;
});

Meteor.methods({
  changeUserPermission: function(user, type) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to promote users");
      throw new Meteor.Error(404, "User not permitted to promote users");
    }
    if(userId == user) {
      logger.error("Admin user cannot change your own permission");
      throw new Meteor.Error(404, "Admin user cannot change your own permission");
    }
    if(!user) {
      logger.error('No user has found');
      throw new Meteor.Error(401, "User not found");
    }
    if(!type) {
      logger.error('Type has not found');
      throw new Meteor.Error(401, "Type has not found");
    }
    var userDoc = Meteor.users.findOne(user);
    if(!userDoc) {
      logger.error('User does not exist');
      throw new Meteor.Error(401, "User does not exist");
    }
    var query = {
      '$set': {}
    };
    var adminCount = Meteor.users.find({"isAdmin": true}).count();
    if(adminCount < 1) {
      if(type == "manager" || type == "worker") {
        logger.error("Can't change type, system needs atleast one admin");
        throw new Meteor.Error(401, "Can't change type, system needs atleast one admin");
      }
    }
    if(type == "admin") {
      query['$set'] = {
        'isAdmin': true,
        'isManager': false,
        'isWorker': false
      }
    } else if(type == "manager") {
      query['$set'] = {
        'isManager': true,
        'isAdmin': false,
        'isWorker': false
      }
    } else if(type == "worker") {
      query['$set'] = {
        'isWorker': true,
        'isAdmin': false,
        'isManager': false
      }
    } else {
      logger.error('Un-expected type');
      throw new Meteor.Error(401, "Un-expected type");
    }
    Meteor.users.update({'_id': user}, query);
    logger.info("User permission updated", {'id': user, 'query': query});
  },

  addSubscription: function(subscription) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    if(!subscription) {
      logger.error('No subscription given');
      throw new Meteor.Error(401, "No subscription given");
    }
    var existingSubscription = Subscriptions.findOne(subscription);
    if(existingSubscription) {
      Subscriptions.update({"_id": subscription}, {$addToSet: {"subscribers":  userId}});
    } else {
      Subscriptions.insert({"_id": subscription, "subscribers":  [userId]});
    }
    logger.info("Subscriber added", {"subscription": subscription, "subscriber": userId});
  }
});