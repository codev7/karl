Meteor.methods({
  subscribe: function(subscription) {
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
  },

  unSubscribe: function(subscription) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    if(!subscription) {
      logger.error('No subscription given');
      throw new Meteor.Error(401, "No subscription given");
    }
    var existingSubscription = Subscriptions.findOne({"_id": subscription, "subscribers": userId});
    if(existingSubscription) {
      Subscriptions.update({'_id': subscription}, {$pull: {"subscribers": userId}});
      logger.info("Subscriber removed", {"menu": subscription, "user": userId});
    }
  }
});