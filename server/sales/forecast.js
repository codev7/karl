Meteor.methods({
  'generateForecastForDay': function(revenue) {
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

    var calibratedSales = SalesCalibration.findOne();
    if(!calibratedSales) {
      logger.error("You should add calibrated data first");
      throw new Meteor.Error(404, "You should add calibrated data first");
    }

    var menus = calibratedSales.menus;
    var result = [];
    menus.forEach(function(menu) {
      var quantity = menu.avg * revenue;
      var obj = {
        "_id": menu._id,
        "quantity": quantity
      }
      result.push(obj);
    })
    logger.info("Forecasted menu items");
    return result;
  },

  'forecastedSales': function(date) {
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
      logger.error('No date has provided');
      throw new Meteor.Error(404, "Date has to be provied");
    }
    var sales = Sales.find({"date": new Date(date)}).fetch();
    return sales;
  }
});