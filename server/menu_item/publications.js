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
  menuCursor = MenuItems.find(query, 
    {fields: {"name": 1, "category": 1, "image": 1, "salesPrice": 1, "status": 1}}, 
    {sort: {"name": 1}, limit: 10});
  logger.info("Menu Items list published", categoryId, status);
  return menuCursor;
});

Meteor.publish("menuItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursor = [];
  var items = MenuItems.find({"_id": {$in: ids}});
  logger.info("Menu items published", ids);
  cursor.push(items);
  return cursor;
});