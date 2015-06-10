Meteor.publish("userSubs", function(ids) {
  var userId = this.userId;
  if(!userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursor = [];
  if(ids.length > 0) {
    logger.info("Subscriptions published ",  {"id": ids});
    return Subscriptions.find({"_id": {$in: ids}});
  }
});