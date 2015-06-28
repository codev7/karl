Accounts.onCreateUser(function(options, user){
  user.profile = options.profile || {};
  user.isActive = true;
  if(user.services.google) {
      user.emails = [{ "address": null}];
      user.emails[0].address = user.services.google.email;
      user.emails[0].verified = user.services.google.verified_email
      user.username = options.profile.name;
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
  changeUserPermission: function(id, type) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!user.isAdmin) {
      logger.error("User not permitted to promote or demote users");
      throw new Meteor.Error(403, "User not permitted to promote or demote users");
    }
    if(user._id == id) {
      logger.error("Admin user cannot change your own permission");
      throw new Meteor.Error(404, "Admin user cannot change your own permission");
    }
    if(!id) {
      logger.error('No user has found');
      throw new Meteor.Error(401, "User not found");
    }
    if(!type) {
      logger.error('Type has not found');
      throw new Meteor.Error(401, "Type has not found");
    }
    var userDoc = Meteor.users.findOne(id);
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
        logger.error("Can't change type, system needs at least one admin");
        throw new Meteor.Error(401, "Can't change type, system needs at least one admin");
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
    Meteor.users.update({'_id': id}, query);
    logger.info("User permission updated", {'id': id, 'type': type});
  },

  editBasicDetails: function(id, editDetails) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    if(!id) {
      logger.error('No user has found');
      throw new Meteor.Error(401, "User not found");
    }
    var userDoc = Meteor.users.findOne(id);
    if(!userDoc) {
      logger.error('User does not exist');
      throw new Meteor.Error(401, "User does not exist");
    }
    if(!editDetails) {
      logger.error('Edit details not found');
      throw new Meteor.Error(401, "Edit details not found");
    }
    var permittedTopLevel = false;
    if(user.isAdmin || user.isManager) {
      permittedTopLevel = true;
    }
    var permittedForMe = (user._id == id);
    if(!permittedForMe && !permittedTopLevel) {
      logger.error("User not permitted to edit users details");
      throw new Meteor.Error(404, "User not permitted to edit users details");
    }

    var query = {};
    if(editDetails.username) {
      query['username'] = editDetails.username;
      query['profile.name'] = editDetails.username;
    }
    if(editDetails.email) {
      query['emails.0.address'] = editDetails.email;
    }
    if(editDetails.phone) {
      query['profile.phone'] = editDetails.phone;
    }
    if(editDetails.weekdaysrate) {
      query['profile.payrates.weekdays'] = editDetails.weekdaysrate;
    }
    if(editDetails.saturdayrate) {
      query['profile.payrates.saturday'] = editDetails.saturdayrate;
    }
    if(editDetails.sundayrate) {
      query['profile.payrates.sunday'] = editDetails.sundayrate;
    }
    if(editDetails.shiftsPerWeek) {
      query['profile.shiftsPerWeek'] = editDetails.shiftsPerWeek;
    }
    Meteor.users.update({"_id": id}, {$set: query});
    logger.info("Users details updated ", editDetails);
  },

  changeStatus: function(id) {
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
    var userDoc = Meteor.users.findOne(id);
    if(!userDoc) {
      logger.error('No user has found', id);
      throw new Meteor.Error(401, "User not found");
    }
    var query = {};
    if(user.isActive) {
      query.isActive = false;
    } else {
      query.isActive = true;
    }
    Meteor.users.update({"_id": id}, {$set: query});
    if(query.isActive) {
      logger.info("User status activated", id);
    } else {
      logger.info("User status de-activated", id);
    }
  }
});

