Meteor.methods({
  createMenu: function(name, menuItems) {
    var date = new Date().toISOString().slice(0,10).replace(/-/g,"-");
    if(name) {
      var name = name;
    } else {
      name = date + " Menu";
    }
    if(menuItems.length < 0) {
      logger.error("Menu items not found");
      throw new Meteor.Error(404, "Menu items not found");
    }
    var doc = {
      "name": name,
      "date": date,
      "menuItems": menuItems,
      "createdOn": new Date().getTime()
    }
    var id = Menus.insert(doc);
    logger.info("Menu inserted", {"id": id, "name": name});
    return id;
  }
});
