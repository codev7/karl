Meteor.methods({
  'readNotifications': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    if(!id) {
      logger.error('Notification id not found');
      throw new Meteor.Error(404, "Notification id not found");
    }
    var notification = Notifications.findOne({'_id': id, 'to': userId});
    if(!notification) {
      logger.error('Notification not found');
      throw new Meteor.Error(404, "Notification not found");
    }
    Notifications.update({'_id': id, 'to': userId}, {$set: {"read": true}});
    logger.info("Notification read", {"user": userId, "notification": id});
  }
});