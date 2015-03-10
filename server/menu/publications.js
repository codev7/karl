Meteor.publish("menus", function() {
  var cursors = [];
  var menus = Menus.find({}, {fields: {"name": 1}});
  cursors.push(menus);
  logger.info("Menus publication");
  return cursors;
});