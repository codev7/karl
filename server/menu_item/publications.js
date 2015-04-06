Meteor.publish("menuList", function() {
  var menuCursor = MenuItems.find({}, {fields: {"name": 1, "tag": 1, "image": 1, "salesPrice": 1}});
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

Meteor.publish("AllCategories", function() {
  return Categories.find();
});