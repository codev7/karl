Meteor.methods({
  createIngredients: function(info) {
    if(!info.code) {
      logger.error("Code field not found");
      throw new Meteor.Error(404, "Code field not found");
    }
    if(!info.description) {
      logger.error("Description field not found");
      throw new Meteor.Error(404, "Description field not found");
    }
    var exist = Ingredients.findOne(info.code);
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    var suppliers = [];
    if(info.suppliers) {
      if(info.suppliers.length > 0) {
        suppliers = info.suppliers;
      } else {
        suppliers.push(info.suppliers);
      }
    }
    var unitPrice = 0;
    if(info.costPerUnit && info.unitSize) {
      unitPrice = parseInt(info.costPerUnit)/parseInt(info.unitSize);
    }
    var doc = {
      "_id": info.code,
      "description": info.description,
      "suppliers": suppliers,
      "unitOrdered": info.unitOrdered,
      "costPerUnit": info.costPerUnit,
      "unitSize": parseInt(info.unitSize),
      "unit": info.unit,
      "portionUsed": info.portionUsed,
      "unitPrice": unitPrice
    }
    var id = Ingredients.insert(doc);
    logger.info("New ingredient inserted ", id);
    return id;
  },

  editIngredient: function(id, info) {
    if(!id) {
      logger.error("Id field not found");
      throw new Meteor.Error(404, "Id field not found");
    }
    var item = Ingredients.findOne(id);
    if(!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }
    var updateDoc = {};
    // if(info.code) {
    //   var checkItems = Ingredients.findOne(info.code);
    //   if(checkItems) {
    //     logger.error("Code exists already");
    //     throw new Meteor.Error(404, "Existing code");
    //   }
    //   updateDoc._id = info.code;
    // }
    if(info.description) {
      if(item.description != info.description) {
        updateDoc.description = info.description;
      }
    }
    if(info.suppliers) {
      if(info.suppliers.length > 0) {
        updateDoc.suppliers = info.suppliers;
      }
    }
    if(info.unitOrdered) {
      if(item.unitOrdered != info.unitOrdered) {
        updateDoc.unitOrdered = info.unitOrdered;
      }
    }
    if(info.unitSize) {
      if(item.unitSize != info.unitSize) {
        updateDoc.unitSize = info.unitSize;
      }
    }
    if(info.costPerUnit) {
      if(item.costPerUnit != info.costPerUnit) {
        updateDoc.costPerUnit = info.costPerUnit;
      }
    }
    if(updateDoc.unitSize && updateDoc.unitPrice) {
      var unitPrice = parseInt(updateDoc.costPerUnit)/parseInt(updateDoc.unitSize);
    } else {
      if(updateDoc.unitSize) {
        var unitPrice = parseInt(item.costPerUnit)/parseInt(updateDoc.unitSize);
      } else if(updateDoc.costPerUnit) {
        var unitPrice = parseInt(updateDoc.costPerUnit)/parseInt(item.unitSize);
      }   
    }
    if(unitPrice) {
      if(unitPrice != item.unitPrice) {
        updateDoc.unitPrice = unitPrice;
      }
    }
    if(info.portionUsed) {
      if(item.portionUsed != info.portionUsed) {
        updateDoc.portionUsed = info.portionUsed;
      }
    }
    if(info.unit) {
      if(item.unit != info.unit) {
        updateDoc.unit = info.unit;
      }
    }
    Ingredients.update({'_id': id}, {$set: updateDoc});
    var loggerDoc = {
      "_id": id
    }
    if(info.code) {
      loggerDoc.codeUpdated = info.code;
    }
    logger.info("Ingredient details updated: ", loggerDoc);
  },

  deleteIngredient: function(id) {
    if(!id) {
      logger.error("Id field not found");
      throw new Meteor.Error(404, "Id field not found");
    }
    var item = Ingredients.findOne(id);
    if(!item) {
      logger.error("Item not found");
      throw new Meteor.Error(404, "Item not found");
    }
    Ingredients.remove(id);
    logger.info("Ingredient removed", id);
  }
});