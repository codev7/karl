Meteor.publish("menuList", function(categoryId, status) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var menuCursor = [];
  var query = {};
  if(categoryId && categoryId != "all") {
    var doc = Categories.findOne(categoryId);
    if(doc) {
      query.category = categoryId;
    }
  }
  if(status && status != "all" ) {
    query.status = status;
  }
  menuCursor = MenuItems.find(query, {fields: {"name": 1, "category": 1, "image": 1, "salesPrice": 1, "status": 1}});
  return menuCursor;
});

Meteor.publish("menuItem", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursor = MenuItems.find(id);
  return cursor;
});

Meteor.publish("menuItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursor = [];
  var items = MenuItems.find({"_id": {$in: ids}});
  cursor.push(items);
  return cursor;
});

Meteor.publish("allCategories", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  return Categories.find();
});

Meteor.publish("allStatuses", function() {
  return Statuses.find();
});