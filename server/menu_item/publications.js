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

Meteor.publish("menuItem", function(id) {
  var cursor = [];
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var menu = MenuItems.find(id);
  cursor.push(menu);

  var menuFetched = menu.fetch()[0];
  var ingIds = [];
  if(menuFetched.ingredients && menuFetched.ingredients.length > 0) {
    menuFetched.ingredients.forEach(function(ing) {
      ingIds.push(ing._id);
    });
    var ingCursor = Ingredients.find({"_id": {$in: ingIds}});
    cursor.push(ingCursor);
  }

  var prepIds = [];
  if(menuFetched.jobItems && menuFetched.jobItems.length > 0) {
    menuFetched.jobItems.forEach(function(prep) {
      prepIds.push(prep._id);
    });
    var prepCursor = JobItems.find({"_id": {$in: prepIds}});
    cursor.push(prepCursor);
  }

  return cursor;
});

Meteor.publish("menuItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursor = [];
  var items = MenuItems.find({"_id": {$in: ids}}, {limit: 10});
  logger.info("Menu items published", ids);
  cursor.push(items);
  return cursor;
});