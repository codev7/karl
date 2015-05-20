Meteor.publish("unReadNotifications", function() {
  var userId = this.userId;
  if(userId) {
    var cursors = [];
    var notifi = Notifications.find({"to": userId, "read": false});
    cursors.push(notifi);
    logger.info("Un-read Notifications published", userId);
    return cursors;
  }
});