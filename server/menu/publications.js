Meteor.publish("menus", function() {
  var cursors = [];
  var menus = Menus.find({}, {fields: {"name": 1}});
  cursors.push(menus);
  logger.info("Menus publication");
  return cursors;
});

Meteor.publish("menu", function(id) {
  var cursors = [];
  var menu = Menus.find({"_id": id}, {fields: {"name": 1, "menuItems": 1}});
  cursors.push(menu);
  return menu;
});