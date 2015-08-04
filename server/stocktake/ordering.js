Meteor.methods({
  generateOrders: function(stockTakeDate) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!stockTakeDate) {
      logger.error("Stocktake date should have a value");
      return new Meteor.Error(404, "Stocktake date should have a value");
    }
    var stocktakes = Stocktakes.find({"date": stockTakeDate}).fetch();
    if(stocktakes.length <= 0) {
      logger.error("No recorded stocktakes found");
      return new Meteor.Error(404, "No recorded stocktakes found");
    }
    stocktakes.forEach(function(stock) {
      var counting = stock.counting;
      // if(stock.active) {
      //   if(stock.ordered) {
      //     counting = (counting - stock.orderedQuantity)
      //   }
      // }


      if(counting > 0) {

        var stockItem = Ingredients.findOne(stock.stockId);
        if(!stockItem) {
          logger.error("Stock item not found");
          return new Meteor.Error(404, "Stock item not found");
        }
        var supplier = null;

        if(stockItem.hasOwnProperty("suppliers") && stockItem.suppliers.length > 0) {
          supplier = stockItem.suppliers[0];
        }

        var existingOrder = OrdersPlaced.findOne({
          "stockId": stock.stockId, 
          "supplier": supplier, 
          "stocktakeDate": stockTakeDate
        });
        if(existingOrder) {

          OrdersPlaced.update({"_id": existingOrder._id}, {$inc: {"orderedCount": counting}});
        } else {

          var currentStock = CurrentStocks.find({"stockId": stock.stockId}, {sort: {"version": -1}, limit: 1}).fetch();
          var countOnHand = 0;
          var orderedCount = counting;
          if(currentStock && currentStock.length > 0) {

            countOnHand = currentStock[0].quantity;
            if(countOnHand > counting) {
              orderedCount = 0;
            } else {
              orderedCount = (counting - countOnHand);
            }
          }
          if(orderedCount > 0) {
            if(stockItem) {
              var order = {
                "stockId": stock.stockId,
                "supplier": supplier,
                "stocktakeDate": stockTakeDate,
                "countOnHand": countOnHand,
                "orderedCount": orderedCount,
                "measure": stockItem.portionOrdered
              }
            }
            OrdersPlaced.insert(order); 
          }
        }  
      }    
    });

  },

  'checkReOrdering': function() {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var pipe = [
      {$group: {
        "_id": "$stockId", 
        "mostRecent": {$max: "$date"}
      }}
    ]
    var data = CurrentStocks.aggregate(pipe, {cursor: {batchSize: 0}});
    return data;
  },

  generateReceipts: function(stocktakeDate, supplier, through) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add job items");
      throw new Meteor.Error(404, "User not permitted to add jobs");
    }
    if(!stocktakeDate) {
      logger.error("Stocktake date should have a value");
      return new Meteor.Error(404, "Stocktake date should have a value");
    }
    if(!supplier) {
      logger.error("Supplier should exist");
      return new Meteor.Error(404, "Supplier should exist");
    }
    if(!through) {
      logger.error("Ordered through should exist");
      return new Meteor.Error(404, "Ordered through should exist");
    }
    var orders = OrdersPlaced.update(
      {"stocktakeDate": stocktakeDate, "supplier": supplier},
      {$set: {"orderedThrough": through, "orderedOn": Date.now()}},
      {$multi: true}
    )
    logger.info("Order receipt generated");
    return;
  }
});