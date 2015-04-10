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
  },

  'getRangedData': function(range) {
    var todayInMiliSecs = new Date().getTime();
    var dateRange = parseInt(range) * 24 * 60 * 60 * 1000;
    var calcMiliSecs = todayInMiliSecs - dateRange;

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
      }
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
  }
});