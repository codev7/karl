Meteor.methods({
  'updateStocktake': function(info) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    var stock = Ingredients.findOne(info.stockId);
    if(!stock) {
      logger.error("Stock item does not exist");
      throw new Meteor.Error(403, "Stock item does not exist");
    }
    var stockTakeExists = Stocktakes.findOne({
      "date": new Date(info.date).getTime(),
      "generalArea": info.generalArea,
      "specialArea": info.specialArea,
      "stockId": info.stockId
    });
    if(stockTakeExists) {
      Stocktakes.update({
        "date": new Date(info.date).getTime(),
        "generalArea": info.generalArea,
        "specialArea": info.specialArea,
        "stockId": info.stockId
        }, {$set: {"counting": info.counting}}
      );
      logger.info("Stocktake updated", stockTakeExists._id);

    } else {
      var doc = {
        "date": new Date(info.date).getTime(),
        "generalArea": info.generalArea,
        "specialArea": info.specialArea,
        "stockId": info.stockId,
        "counting": info.counting,
        "costPerPortion": stock.costPerPortion,
        "active": false
      }
      var id = Stocktakes.insert(doc);
      logger.info("New stocktake created", id);
    }
    return;
  },

  removeStockItems: function(stocktakeId) {
    var user = Meteor.user();
    if(!user) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var permitted = isManagerOrAdmin(user);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(403, "User not permitted to create ingredients");
    }
    var stockItemExists = Stocktakes.findOne(stocktakeId);
    if(!stockItemExists) {
      logger.error('Stock item does not exist in stocktake', {"stockId": stockId, "stocktakeId": stocktakeId});
      throw new Meteor.Error(404, "Stock item does not exist in stocktake");
    }
    Stocktakes.remove({"_id": stocktakeId});
    logger.info("Stocktake removed", stocktakeId);

  }
});