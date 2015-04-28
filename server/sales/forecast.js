Meteor.methods({
  'generateForecastForDay': function(id, revenue) {
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
    var exist = ForecastCafe.findOne({"_id": id, "expectedRevenue": revenue});
    if(!exist || exist.menus.length <= 0) {
      var menus = calibratedSales.menus;
      var result = [];
      menus.forEach(function(menu) {
        var quantity = menu.avg * revenue;
        if(quantity > 0) {
          var obj = {
            "_id": menu._id,
            "quantity": Math.round(quantity)
          }
          result.push(obj);
        }
      });
      ForecastCafe.update({"_id": id}, {$set: {"menus": result}});
    }
    logger.info("Forecasted menu items");
    return;
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
      "menus": []
    }
    var exist = ForecastCafe.findOne({"date": new Date(date).getTime()});
    if(!exist) {
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
    
    var exist = ForecastCafe.findOne(id);
    if(!exist) {
      logger.error('Entry does not exist');
      throw new Meteor.Error(404, "Entry does not exist");
    }
    ForecastCafe.update({"_id": id}, {$set: {"expectedRevenue": parseFloat(revenue)}});
    logger.info("Forecast for cafe updated", id);
  },

  'updateForcastedMenus': function(id, menuId, quantity) {
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
    if(!menuId) {
      logger.error('MenuId should have a value');
      throw new Meteor.Error(404, "MenuId should have a value");
    }
    var existingMenuItem = ForecastCafe.findOne(
      {"_id": id, "menus": {$elemMatch: {"_id": menuId}}},
      {fields: {"menus": {$elemMatch: {"_id": menuId}}}}
    );
    if(existingMenuItem) {
      var doc = existingMenuItem.menus[0];
      if(doc.quantity != quantity) {
        if(quantity <= 0) {
          var query = {
            $pull: {"menus": existingMenuItem.menus[0]}
          }
          ForecastCafe.update({"_id": id, "menus": {$elemMatch: {"_id": menuId}}}, query);
        } else {
          ForecastCafe.update({"_id": id, "menus": {$elemMatch: {"_id": menuId}}}, {$set: {"menus.$.quantity": quantity}});
        }
      } 
    } else {
      var query = {
        $addToSet: {}
      }
      query['$addToSet']['menus'] = {"_id": menuId, "quantity": quantity}
      ForecastCafe.update({"_id": id}, query);
    }
    logger.info("Forecasted menu update");
  }
});