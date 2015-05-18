Meteor.publish("menuSubs", function(menuId, subscriber) {
  var cursor = [];
  var listSubscription = Subscriptions.find({"_id": "menuList", "subscribers": subscriber});
  if(listSubscription.fetch().length > 0) {
    cursor.push(listSubscription);
  } else {
    if(menuId) {
      var itemSubscription = Subscriptions.find({"_id": menuId, "subscribers": subscriber});
      if(itemSubscription) {
        cursor.push(itemSubscription);
      }
    }
  }
  logger.info("menu subscriptions published");
  return cursor;
});