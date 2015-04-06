Meteor.publish("menuList", function(categoryId) {
  var menuCursor = [];
  var query = {};
  if(categoryId && categoryId != "all") {
    var doc = Categories.findOne(categoryId);
    if(doc) {
      query.category = categoryId;
    }
  }
  menuCursor = MenuItems.find(query, {fields: {"name": 1, "category": 1, "image": 1, "salesPrice": 1}});
  return menuCursor;
});

Meteor.publish("menuItem", function(id) {
  var cursor = MenuItems.find(id);
  return cursor;
});

Meteor.publish("menuItems", function(ids) {
  var cursor = [];
  var items = MenuItems.find({"_id": {$in: ids}});
  cursor.push(items);
  return cursor;
});

Meteor.publish("allCategories", function() {
  return Categories.find();
});