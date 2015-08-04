Meteor.publish("allIngredients", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = Ingredients.find({"status": "active"}, {sort: {'code': 1}, limit: 10});
  logger.info("All ingredients published");
  return cursors;
});

Meteor.publish("ingredients", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var ings = null;
  if(ids.length > 0) {
    ings = Ingredients.find({"_id": {$in: ids}}, {sort: {'code': 1}});
  } else {
    ings = Ingredients.find({}, {sort: {'code': 1}, limit: 10});
  }
  cursors.push(ings);
  logger.info("Ingredients published", {"ids": ids});
  return cursors;
});