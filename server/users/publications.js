Meteor.publish('currentUser', function() {
  var user = Meteor.users.find(this.userId);
  return user;
});

Meteor.publish("usersList", function() {
  var options = {
    "isAdmin": 1,
    "isWorker": 1,
    "isManager": 1,
    "username": 1,
    "profile": 1,
    "emails": 1,
    "services": 1
  };
  var users = Meteor.users.find({}, {fields: options});
  return users;
});