Meteor.methods({
  createMenuItem: function(info) {
    if(!info.name) {
      logger.error("Menu item should have a name");
      throw new Meteor.Error(404, "Menu item should have a name");
    }
    var doc = {
      "name": info.name,
      "tag": info.tag,
      "instructions": info.instructions,
      "ingredients": info.ingredients,
      "jobItems": info.prepItems,
      "salesPrice": parseFloat(info.salesPrice),
      "staus": "active"
    };
    var id = MenuItems.insert(doc);
    logger.info("Menu items added ", id);
    return id;
  },

  editMenuItem: function(id, info) {
    if(!id) {
      logger.error("Menu item should provide a id");
      throw new Meteor.Error(404, "Menu item should provide a id");
    }
    var item = MenuItems.findOne(id);
    if(!item) {
      logger.error("Menu item should exist");
      throw new Meteor.Error(404, "Menu item should exist");
    }
    var jobItemsIds = [];
    if(item.jobItems && item.jobItems.length > 0) {
      item.jobItems.forEach(function(doc) {
        jobItemsIds.push(doc.id);
      });
    }

    var ingredientIds = [];
    if(item.ingredients && item.ingredients.length > 0) {
      item.ingredients.forEach(function(doc) {
        ingredientIds.push(doc.id);
      });
    }
    if(Object.keys(info).length < 0) {
      logger.error("Menu item should provide fields to be updated");
      throw new Meteor.Error(404, "Menu item should provide fields to be updated");
    }
    var query = {
      $set: {},
      $push: {}
    }
    var updateDoc = {};
    if(info.name) {
      if(info.name != item.name) {
        updateDoc.name = info.name;
      }
    }
    if(info.tag) {
      if(info.tag != item.tag) {
        updateDoc.tag = info.tag;
      }
    }
    if(info.salesPrice) {
      if(info.salesPrice != item.salesPrice) {
        updateDoc.salesPrice = info.salesPrice;
      }
    }
    if(info.instructions) {
      if(info.instructions != item.instructions) {
        updateDoc.instructions = info.instructions;
      }
    }
    var updateJobItems = [];
    if(info.jobItems && info.jobItems.length > 0) {
      if(info.jobItemsIds && info.jobItemsIds.length > 0) {
        info.jobItemsIds.forEach(function(thisId) {
          var index = jobItemsIds.indexOf(thisId);
          var point = info.jobItemsIds.indexOf(thisId);
          if(index < 0) {
            updateJobItems.push(info.jobItems[point]);
          } else {
            var exist = MenuItems.findOne(
              {"_id": id, "jobItems": {$elemMatch: {"id": thisId}}},
              {fields: {"jobItems": {$elemMatch: {"id": thisId}}}});
            if(exist) {
              var item = info.jobItems[point];
              if(exist.jobItems[0].id == item.id) {
                if(exist.jobItems[0].quantity != item.quantity) {
                  MenuItems.update({'_id': id}, {$pull: {"jobItems": exist.jobItems[0]}});
                  updateJobItems.push(item);
                }
              }
            }
          }
        });        
      }
    }

    var updateIngredients = [];
    if(info.ingredients && info.ingredients.length > 0) {
      if(info.ingredientIds && info.ingredientIds.length > 0) {
        info.ingredientIds.forEach(function(thisId) {
          var index = ingredientIds.indexOf(thisId);
          var point = info.ingredientIds.indexOf(thisId);
          if(index < 0) {
            updateIngredients.push(info.ingredients[point]);
          } else {
            var exist = MenuItems.findOne(
              {"_id": id, "ingredients": {$elemMatch: {"id": thisId}}},
              {fields: {"ingredients": {$elemMatch: {"id": thisId}}}});
            if(exist) {
              var item = info.ingredients[point];
              if(exist.ingredients[0].id == item.id) {
                if(exist.ingredients[0].quantity != item.quantity) {
                  MenuItems.update({'_id': id}, {$pull: {"ingredients": exist.ingredients[0]}});
                  updateIngredients.push(item);
                }
              }
            }
          }
        });
        
      }
    }
    if(Object.keys(updateDoc).length > 0) {
      query['$set'] = updateDoc;
    }
    if(Object.keys(updateJobItems).length > 0) {
      query['$push'] = {"jobItems": {$each: updateJobItems}};
    }
    if(Object.keys(updateIngredients).length > 0) {
      query['$push'] = {"ingredients": {$each: updateIngredients}};
    }
    MenuItems.update({"_id": id}, query);
    logger.info("Menu item updated ", id);
    return;
  },

  deleteMenuItem: function(id) {
    if(!id) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var item = MenuItems.findOne(id);
    if(!item) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    var result = MenuItems.remove(id);
    // var result = MenuItems.update({"_id": id}, {$set: {"status": false}});
    return result;
  },

  addIngredients: function(menuId, ingredients) {
    // console.log("-------", arguments);
    if(!menuId) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    if(ingredients.length < 0) {
      logger.error("Ingredients should be an array of items");
      throw new Meteor.Error(404, "Ingredients should be an array of items");
    }
    var updateIngredients = [];
    var ingredientIds = [];
    if(menuItem.ingredients.length > 0) {
      updateIngredients = menuItem.ingredients;
      menuItem.ingredients.forEach(function(item) {
        ingredientIds.push(item.id);
      });
    }
    ingredients.forEach(function(item) {
      if(item.id && item.quantity) {
        if(ingredientIds.indexOf(item.id) < 0) {
          updateIngredients.push(item);
          ingredientIds.push(item.id);
        } else {
          var index = ingredientIds.indexOf(item.id);
          updateIngredients[index].quantity = item.quantity;
        }
      }
    });
    // console.log(updateIngredients);
    MenuItems.update({'_id': menuId}, {$set: {'ingredients': updateIngredients}});
    logger.info("Ingredients updated for menu item", menuId);
    return;
  },

  removeIngredients: function(menuId, ingredient) {
    if(!menuId) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    if(menuItem.ingredients.length < 0) {
      logger.error("Ingredients does not exist for this menu item");
      throw new Meteor.Error(404, "Ingredients does not exist for this menu item");
    }
    var item = MenuItems.findOne(
      {"_id": menuId, "ingredients": {$elemMatch: {"_id": ingredient}}},
      {fields: {"ingredients": {$elemMatch: {"_id": ingredient}}}}
    );
    var query = {
      $pull: {}
    };
    if(!item) {
      logger.error("Ingredients does not exist");
      throw new Meteor.Error(404, "Ingredients does not exist");
    }
    query['$pull']['ingredients'] = item.ingredients[0];
    MenuItems.update({'_id': menuId}, query);
    logger.info("Ingredients removed from menu item", menuId);
  },

  addJobItems: function(menuId, jobItems) {
    if(!menuId) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    if(jobItems.length < 0) {
      logger.error("Job Items should be an array of items");
      throw new Meteor.Error(404, "Job Items should be an array of items");
    }
    var updateJobItems = [];
    var jobItemIds = [];
    if(menuItem.jobItems) {
      if(menuItem.jobItems.length > 0) {
        updateJobItems = menuItem.jobItems;
        menuItem.jobItems.forEach(function(item) {
          jobItemIds.push(item.id);
        });
      }
    }
    jobItems.forEach(function(item) {
      if(item.id && item.quantity) {
        if(jobItemIds.indexOf(item.id) < 0) {
          updateJobItems.push(item);
          jobItemIds.push(item.id);
        } else {
          var index = jobItemIds.indexOf(item.id);
          updateJobItems[index].quantity = item.quantity;
        }
      }
    });
    if(Object.keys(updateJobItems).length > 0) {
      MenuItems.update({'_id': menuId}, {$set: {'jobItems': updateJobItems}});
      logger.info("Job Items updated for menu item", menuId);
    }
    return;
  }
});