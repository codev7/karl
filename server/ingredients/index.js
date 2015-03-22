Meteor.methods({
  createIngredients: function(info) {
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
    if(!info.costPerPortion) {
      info.costPerPortion = 0;
    }
    if(!info.unitSize) {
      info.unitSize = 0;
    }
    var doc = {
      "code": info.code,
      "description": info.description,
      "suppliers": suppliers,
      "portionOrdered": info.portionOrdered,
      "costPerPortion": info.costPerPortion,
      "portionUsed": info.portionUsed,
      "unitSize": parseFloat(info.unitSize),
      "createdOn": Date.now(),
      "createdBy": userId
    }
    var id = Ingredients.insert(doc);
    logger.info("New ingredient inserted ", id);
    return id;
  },

  editIngredient: function(id, info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to edit ingredients");
      throw new Meteor.Error(404, "User not permitted to edit ingredients");
    }
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
        if(info.description != null) {
          updateDoc.description = info.description;
        }
      }
    }
    if(info.suppliers) {
      updateDoc.suppliers = info.suppliers;
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
    if(Object.keys(updateDoc).length > 0) {
      updateDoc['editedOn'] = Date.now();
      updateDoc['editedBy'] = userId;
      Ingredients.update({'_id': id}, {$set: updateDoc});
      logger.info("Ingredient details updated: ", id);
    }
  },

  deleteIngredient: function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to delete ingredients");
      throw new Meteor.Error(404, "User not permitted to delete ingredients");
    }
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
    if(existInPreps) {
      if(existInPreps.ingredients.length > 0) {
        logger.error("Item found in Prep jobs, can't delete");
        throw new Meteor.Error(404, "Item is in use on prep jobs, cannot be deleted."); 
      }
    }
    var existInMenuItems = MenuItems.findOne(
      {"ingredients": {$elemMatch: {"_id": id}}},
      {fields: {"ingredients": {$elemMatch: {"_id": id}}}}
    );
    if(existInMenuItems) {
      if(existInMenuItems.ingredients.length > 0) {
        logger.error("Item found in Menu Items, can't delete");
        throw new Meteor.Error(404, "Item is in use on menu items, cannot be deleted."); 
      }
    }
    Ingredients.remove(id);
    logger.info("Ingredient removed", id);
  }
});