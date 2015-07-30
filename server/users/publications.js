Meteor.publish('profileUser', function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var options = {
    "services.google": 1,
    "isAdmin": 1,
    "isWorker": 1,
    "isManager": 1,
    "isActive": 1,
    "profile": 1,
    "username": 1
  }
  var user = Meteor.users.find({"_id": id}, {fields: options});
  logger.info("User published ", id);
  return user;
});

Meteor.publish("usersList", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var options = {
    "isAdmin": 1,
    "isWorker": 1,
    "isManager": 1,
    "username": 1,
    "emails": 1,
    "isActive": 1,
    "profile.payrates": 1
  };
  var users = Meteor.users.find({}, {fields: options}, {limit: 10});
  logger.info("Userlist published");
  return users;
});

//managers and workers that should be assigned to shifts
Meteor.publish("workers", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  cursors.push(Meteor.users.find({"isActive": true, $or: [{"isWorker": true}, {"isManager": true}]}));

  return cursors;
});