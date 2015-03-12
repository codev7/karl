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
    var exist = Ingredients.findOne({"code": info.code});
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change code and try again");
    }
    var suppliers = [];
    if(info.suppliers) {
      if(info.suppliers.length > 0) {
        suppliers = info.suppliers;
      } else {
        suppliers.push(info.suppliers);
      }
    }
    var doc = {
      "code": info.code,
      "description": info.description,
      "suppliers": suppliers,
      "portionOrdered": info.portionOrdered,
      "costPerPortion": info.costPerPortion,
      "portionUsed": info.portionUsed,
      "unitSize": parseFloat(info.unitSize),
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
    if(info.code) {
      if(item.code != info.code) {
        updateDoc.code = info.code;
      }
    }
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
    if(info.portionOrdered) {
      if(item.portionOrdered != info.portionOrdered) {
        updateDoc.portionOrdered = info.portionOrdered;
      }
    }
    if(info.unitSize) {
      if(item.unitSize != info.unitSize) {
        updateDoc.unitSize = parseFloat(info.unitSize);
      }
    }
    if(info.costPerPortion) {
      if(item.costPerPortion != info.costPerPortion) {
        updateDoc.costPerPortion = parseFloat(info.costPerPortion);
      }
    }
    if(info.portionUsed) {
      if(item.portionUsed != info.portionUsed) {
        updateDoc.portionUsed = info.portionUsed;
      }
    }
    Ingredients.update({'_id': id}, {$set: updateDoc});
    logger.info("Ingredient details updated: ", id);
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
    var existInPreps = JobItems.findOne(
      {"type": "Prep", "ingredients": {$elemMatch: {"_id": id}}},
      {fields: {"ingredients": {$elemMatch: {"_id": id}}}}
    );
    console.log(existInPreps);
    if(existInPreps) {
      logger.error("Item found in Prep jobs, can't delete");
      throw new Meteor.Error(404, "Item cannot be deleted"); 
    }
    Ingredients.remove(id);
    logger.info("Ingredient removed", id);
  }
});