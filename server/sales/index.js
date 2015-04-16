Meteor.methods({
  'createSalesMenus': function(date) {
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
    var existingMenuItems = MenuItems.find({"status": "active"}).fetch();
    var existingSalesCount = Sales.find({"date": new Date(date)}).count();
    existingMenuItems.forEach(function(menuItem) {
      var exist = Sales.findOne({"menuItem": menuItem._id, "date": new Date(date)});
      if(!exist) {
        var doc = {
          "date": new Date(date),
          "menuItem": menuItem._id,
          "quantity": 0,
          "soldAtPrice": menuItem.salesPrice,
          "createdOn": new Date(),
          "createdBy": userId
        }
        var id = Sales.insert(doc)
        logger.info("New sales entry created", {"id": id});
      }
    });
    return;
  },

  'editSalesMenuQuantity': function(id, menuId, quantity) {
    this.unblock();
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
    var salesMenu = Sales.findOne({"_id": id, "menuItem": menuId});
    if(!salesMenu) {
      logger.error("Sales Menu does not exist");
      throw new Meteor.Error(404, "Sales Menu does not exist");
    }
    var quantity = parseInt(quantity);
    if(!quantity || quantity < 0) {
      quantity = 0;
    } else if(quantity === NaN) {
      quantity = 0;
    }
    logger.info("Sales entry updated", {"id": id});
    return Sales.update({"_id": id}, {$set: {"quantity": quantity}});
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
  },

  'getRangedData': function(range) {
    var dateRange = 0;
    if(parseInt(range) >= 0) {
      dateRange = parseInt(range);
    }
    var todayInMiliSecs = new Date().getTime();
    if(dateRange >= 0) {
      var dateRangeMili = parseInt(range) * 24 * 60 * 60 * 1000;
      var calcMiliSecs = todayInMiliSecs - dateRangeMili;

      var historyDate = new Date(calcMiliSecs).toJSON().slice(0, 10);
      var today = new Date().toJSON().slice(0, 10);

      var pipe = [{
          $match: {
            "date": { $gte: new Date(historyDate), $lte: new Date(today)}
          }
        },
        { $group: {
            _id: "$menuItem",
            quantity: { $sum: "$quantity"}
          }
        },
        { $sort: { quantity: -1 }}
      ]
      var sales = Sales.aggregate(pipe, {cursor: { batchSize: 0 }});

      if(sales.length > 0) {
        sales.forEach(function(sale) {
          var doc = MenuItems.findOne(
            {_id: sale._id}, 
            {fields: {name: 1, salesPrice: 1, category: 1, status: 1}}
          )
          sale['name'] = doc.name;
        });
        return sales;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
});