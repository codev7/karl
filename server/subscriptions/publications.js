Meteor.publish("userSubs", function(type, id, subscriber) {
  var cursor = [];
  if(type == "menulist" || type == "joblist") {
    if(id) {
      var itemSubscription = Subscriptions.find({"_id": id, "subscribers": subscriber});
      if(itemSubscription) {
        cursor.push(itemSubscription);
      }
    } else {
      var listSubscription = Subscriptions.find({"_id": type, "subscribers": subscriber});
      cursor.push(listSubscription);  
    }
    logger.info("User subscriptions published", type, id);
    return cursor;
  }
});