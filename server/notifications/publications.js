Meteor.publish("newNotifications", function() {
  var userId = this.userId;
  if(!userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var notifi = Notifications.find(
    {"to": userId, "read": false}, 
    {fileds: {'_id': 1, "read": 1, "to": 1, "createdOn": 1}},
    {sort: {"createdOn": -1}}
  );
  cursors.push(notifi);
  logger.info("New notifications for " + userId + " published");
  return cursors;
});

Meteor.publish("readNotifications", function() {
  var userId = this.userId;
  if(!userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var notifi = Notifications.find(
    {"to": userId, "read": true}, 
    {fileds: {'_id': 1, "read": 1, "to": 1, "createdOn": 1}},
    {sort: {"createdOn": -1}, limit: 10}
  );
  cursors.push(notifi);
  logger.info("Read notifications for " + userId + " published");
  return cursors;
});