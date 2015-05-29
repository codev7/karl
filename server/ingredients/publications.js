Meteor.publish("allIngredients", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  // var permitted = isManagerOrAdmin(this.userId);
  // if(!permitted) {
  //   logger.error("User not permitted to publish all ingredients");
  //   this.error(new Meteor.Error(404, "User not permitted to publish all ingredients"));
  // }
  var cursors = Ingredients.find({}, {sort: {'code': 1}});
  return cursors;
});

Meteor.publish("ingredients", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  // var permitted = isManagerOrAdmin(this.userId);
  // if(!permitted) {
  //   logger.error("User not permitted to publish ingredients");
  //   this.error(new Meteor.Error(404, "User not permitted to publish ingredients"));
  // }
  var cursors = [];
  var ings = null;
  if(ids.length > 0) {
    ings = Ingredients.find({"_id": {$in: ids}}, {sort: {'code': 1}});
  } else {
    ings = Ingredients.find({}, {sort: {'code': 1}, limit: 10});
  }
  cursors.push(ings);
  return cursors;
});