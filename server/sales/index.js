Meteor.methods({
  'createSalesMenus': function(date, menuId, quantity) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(404, "User not permitted to create ingredients");
    }
    if(!date) {
      logger.error("Date field does not exist");
      throw new Meteor.Error(404, "Date field does not exist");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    var doc = {
      "date": date,
      "menuItem": menuId,
      "quantity": quantity,
      "soldAtPrice": menuItem.salesPrice,
      "createdOn": new Date(),
      "createdBy": userId
    }
    var id = Sales.insert(doc);
    logger.info("New sales entry created", {"id": id});
    return;

  },

  'editSalesMenuQuantity': function(id, menuId, quantity) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(404, "User not permitted to create ingredients");
    }
    if(!date) {
      logger.error("Date field does not exist");
      throw new Meteor.Error(404, "Date field does not exist");
    }
    var salesMenu = Sales.findOne({"_id": id, "menuItem": menuId});
    if(!salesMenu) {
      logger.error("Sales Menu does not exist");
      throw new Meteor.Error(404, "Sales Menu does not exist");
    }
    var id = Sales.update({"_id": id}, {$set: {"quantity": quantity}});
    logger.info("Sales entry updated", {"id": id});
    return;

  },

  'deleteSalesMenu': function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(404, "User not permitted to create ingredients");
    }
    if(!id) {
      logger.error('Id not found');
      throw new Meteor.Error(401, "Id not found");
    }
    var salesMenu = Sales.findOne(id);
    if(!salesMenu) {
      logger.error('Sales Menu does not exist');
      throw new Meteor.Error(401, "Sales Menu does not exist");
    }
    Sales.remove({"_id": id});
    logger.info("Sales entry deleted ", {"id": id});
    return;
  }
});