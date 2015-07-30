Meteor.publish("menus", function() {
  var cursors = [];
  var menus = Menus.find({}, {fields: {"name": 1}}, {limit: 10});
  cursors.push(menus);
  logger.info("Menus publication");
  return cursors;
});

Meteor.publish("menu", function(id) {
  var cursors = [];
  var menu = Menus.find({"_id": id}, {fields: {"name": 1, "menuItems": 1}});
  if(menu) {
    cursors.push(menu);
    var menuFetched = menu.fetch();
    if(menuFetched[0].menuItems.length > 0)  {
      var menuItems = MenuItems.find({"_id": {$in: menuFetched[0].menuItems}}, {fields: {"name": 1, "salesPrice": 1, "tag": 1}});
      cursors.push(menuItems);      
    }
  }
  return cursors;
});