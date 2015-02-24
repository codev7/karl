Meteor.methods({
  createMenuItem: function(info) {
    if(!info.name) {
      logger.error("Menu item should have a name");
      throw new Meteor.Error(404, "Menu item should have a name");
    }
    // if(!info.tag) {
    //   logger.error("Menu item should have a tag");
    //   throw new Meteor.Error(404, "Menu item should have a tag");
    // }
    var id = MenuItems.insert(info);
    logger.info("Menu items added ", id);
    return id;
  },

  editMenuItem: function(id, info) {
    if(!id) {
      logger.error("Menu item should provide a id");
      throw new Meteor.Error(404, "Menu item should provide a id");
    }
    if(Object.keys(info).length < 0) {
      logger.error("Menu item should provide fields to be updated");
      throw new Meteor.Error(404, "Menu item should provide fields to be updated");
    }
    var result = MenuItems.update({"_id": id}, {$set: info});
    logger.info("Menu item updated ", id);
    return result;
  },

  deleteMenuItem: function(id) {
    if(!id) {
      logger.error("Menu item should provide a id");
      throw new Meteor.Error(404, "Menu item should provide a id");
    }
    var result = MenuItems.update({"_id": id}, {$set: {"status": false}});
    return result;
  }
});