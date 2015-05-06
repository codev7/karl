Meteor.methods({
  'calibratedSales': function(range) {
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
            quantity: { $sum: "$quantity"},
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
          if(doc) {
            sale['name'] = doc.name;
          }
        });
        return sales;
      } else {
        return [];
      }
    } else {
      return [];
    }
  },

  'createSalesCalibration': function(range, revenue, menus) {
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
    if(!range) {
      logger.error('Range should exist');
      throw new Meteor.Error(404, "Range should exist");
    }
    if(!revenue) {
      logger.error('Revenue should exist');
      throw new Meteor.Error(404, "Revenue should exist");
    }
    var doc = {
      "range": range,
      "revenue": parseFloat(revenue),
      "menus": menus
    }
    var id = SalesCalibration.insert(doc);
    logger.info("Sales Calibration inserted", id);
    return id;
  },

  'updateSalesCalibration': function(id, range, revenue, menus) {
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
    if(!range) {
      logger.error('Range should exist');
      throw new Meteor.Error(404, "Range should exist");
    }
    if(!revenue) {
      logger.error('Revenue should exist');
      throw new Meteor.Error(404, "Revenue should exist");
    }
    var doc = {
      "range": range,
      "revenue": parseFloat(revenue),
      "menus": menus
    }
    SalesCalibration.update({"_id": id}, {$set: doc});
    logger.info("Sales Calibration updated", id);
    return id;
  }
});