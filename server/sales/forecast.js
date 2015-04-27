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
  },

  'createForecast': function(date) {
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
    var doc = {
      "date": new Date(date).getTime(),
      "expectedRevenue": 0,
      "menus": [],
      "selected": []
    }
    var exist = ForecastCafe.findOne({"date": new Date(date).getTime()});
    if(exist) {
      logger.error("Already exists");
    } else {
      var id = ForecastCafe.insert(doc);
      logger.info("Forecast for cafe created", {"id": id, "date": date});
      return id;
    }
  },

  'updateForecast': function(id, revenue) {
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
      logger.error('Id should have a value');
      throw new Meteor.Error(404, "Id should have a value");
    }

    if(!revenue) {
      logger.error('Revenue should have a value');
      throw new Meteor.Error(404, "Revenue should have a value");
    }
    
    var exist = ForecastCafe.findOne({"_id": id});
    if(!exist) {
      logger.error('Entry does not exist');
      throw new Meteor.Error(404, "Entry does not exist");
    }
    ForecastCafe.update({"_id": id}, {$set: {"expectedRevenue": parseFloat(revenue)}});
    logger.info("Forecast for cafe updated", id);
  }
});