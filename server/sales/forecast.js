Meteor.methods({
  'createSalesForecast': function(date, menuId, quantity) {
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
    var exist = Sales.findOne({"date": date, "menuItem": menuId});
    if(exist) {
      logger.error("Menu item already added");
      throw new Meteor.Error(404, "Menu item already added");
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
    var id = SalesForecast.insert(doc);
    logger.info("New sales forecast entry created", {"id": id});
    return;
  }
});