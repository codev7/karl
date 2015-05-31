Meteor.methods({
  createMenuItem: function(info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create menu items");
      throw new Meteor.Error(404, "User not permitted to create menu");
    }
    if(!info.name) {
      logger.error("Menu item should have a name");
      throw new Meteor.Error(404, "Menu item should have a name");
    }
    if(!info.category) {
      logger.error("Menu item should have a category");
      throw new Meteor.Error(404, "Menu item should have a category");
    }
    var exist = MenuItems.findOne({"name": info.name});
    if(exist) {
      logger.error("Duplicate entry");
      throw new Meteor.Error(404, "Duplicate entry, change name and try again");
    }
    var doc = {
      "name": info.name,
      "category": info.category,
      "instructions": info.instructions,
      "ingredients": info.ingredients,
      "jobItems": info.prepItems,
      "salesPrice": parseFloat(info.salesPrice),
      "image": info.image,
      "createdOn": Date.now(),
      "createdBy": userId
    };
    if(info.status) {
      doc.status = info.status
    } else {
      doc.status = "active"
    }
    var id = MenuItems.insert(doc);
    logger.info("Menu items added ", id);
    return id;
  },

  editMenuItem: function(id, info) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to edit menu item");
      throw new Meteor.Error(404, "User not permitted to edit menu");
    }
    if(!id) {
      logger.error("Menu item should provide a id");
      throw new Meteor.Error(404, "Menu item should provide a id");
    }
    var item = MenuItems.findOne(id);
    if(!item) {
      logger.error("Menu item should exist");
      throw new Meteor.Error(404, "Menu item should exist");
    }
    var query = {
      $set: {}
    }
    var updateDoc = {};
    if(info.name) {
      if(info.name != item.name) {
        updateDoc.name = info.name;
      }
    }
    if(info.category) {
      if(info.category != item.category) {
        updateDoc.category = info.category;
      }
    }
    if(info.status) {
      if(info.status != item.status) {
        updateDoc.status = info.status;
      }
    }
    if(info.salesPrice || (info.salesPrice >= 0)) {
      if(info.salesPrice != item.salesPrice) {
        updateDoc['salesPrice'] = info.salesPrice;
      }
    }
    if(info.instructions) {
      if(info.instructions != item.instructions) {
        updateDoc.instructions = info.instructions;
      }
    }
    updateDoc.ingredients = [];
    if(info.ingredients) {
      if(info.ingredients.length > 0) {
        var ingIds = [];
        info.ingredients.forEach(function(item) {
          if(ingIds.indexOf(item._id) < 0) {
            ingIds.push(item._id);
            updateDoc.ingredients.push(item);
          }
        });
      }
    }
    updateDoc.jobItems = [];
    if(info.jobItems) {
      if(info.jobItems.length > 0) {
        var jobIds = [];
        info.jobItems.forEach(function(item) {
          if(jobIds.indexOf(item._id) < 0) {
            jobIds.push(item._id);
            updateDoc.jobItems.push(item);
          }
        });
      }
    }
    if(info.image) {
      updateDoc.image = info.image;
    }
    if(Object.keys(updateDoc).length > 0) {
      var editedTime = Date.now();
      updateDoc['editedBy'] = userId;
      updateDoc['editedOn'] = editedTime;
      query['$set'] = updateDoc;

      MenuItems.update({"_id": id}, query);
      logger.info("Menu item updated ", id);
      return;
    }
  },

  deleteMenuItem: function(id) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to delete menu item");
      throw new Meteor.Error(404, "User not permitted to delete menu");
    }
    if(!id) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var item = MenuItems.findOne(id);
    if(!item) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    //should not remove in case if menu item is used in a menu
    var existOnSales = Sales.findOne({"menuItem": id});
    if(existOnSales) {
      logger.error("Can't delete. Exist on sales");
      throw new Meteor.Error(404, "You can't delete this menu");
    }
    var result = MenuItems.remove(id);
    return result;
  },

  addIngredients: function(menuId, ingredients) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add ingredients to menu item");
      throw new Meteor.Error(404, "User not permitted to add ingredients to menu");
    }
    if(!menuId) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    var menuIngredients = menuItem.ingredients;

    if(ingredients.length < 0) {
      logger.error("Ingredients should be an array of items");
      throw new Meteor.Error(404, "Ingredients should be an array of items");
    }

    ingredients.forEach(function(ingredient) {
      var exist = MenuItems.findOne(
        {"_id": menuId, "ingredients": {$elemMatch: {"_id": ingredient._id}}}, 
        {"fields": {"ingredients": {$elemMatch: {"_id": ingredient._id}}}});

      if(exist.ingredients[0]._id == ingredient._id) {
        if(exist.ingredients[0].quantity != ingredient.quantity) {
          MenuItems.update({'_id': menuId, "ingredients": {$elemMatch: {"_id": ingredient._id}}}, 
            {$set: {'ingredients.$.quantity': ingredient.quantity}});   
        }
      } else {
        MenuItems.update({'_id': menuId}, 
          {$push: {'ingredients': ingredient}});  
      }
    });
    logger.info("Ingredients updated for menu item", menuId);
    return;
  },

  removeMenuIngredient: function(menuId, ingredient) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to remove ingredients from menu item");
      throw new Meteor.Error(404, "User not permitted to remove ingredients from menu");
    }
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
    return;
  },

  removeMenuJobItem: function(menuId, jobItem) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to remove ingredients from menu item");
      throw new Meteor.Error(404, "User not permitted to remove ingredients from menu");
    }
    if(!menuId) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    if(menuItem.jobItems.length < 0) {
      logger.error("Prep items does not exist for this menu item");
      throw new Meteor.Error(404, "Prep items does not exist for this menu item");
    }
    var item = MenuItems.findOne(
      {"_id": menuId, "jobItems": {$elemMatch: {"_id": jobItem}}},
      {fields: {"jobItems": {$elemMatch: {"_id": jobItem}}}}
    );
    var query = {
      $pull: {}
    };
    if(!item) {
      logger.error("Prep items does not exist");
      throw new Meteor.Error(404, "Prep items does not exist");
    }
    query['$pull']['jobItems'] = item.jobItems[0];
    MenuItems.update({'_id': menuId}, query);
    logger.info("Prep item removed from menu item", menuId);
    return;
  },

   addJobItem: function(menuId, preps) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to add ingredients to menu item");
      throw new Meteor.Error(404, "User not permitted to add ingredients to menu");
    }
    if(!menuId) {
      logger.error("Menu item should provide an id");
      throw new Meteor.Error(404, "Menu item should provide an id");
    }
    var menuItem = MenuItems.findOne(menuId);
    if(!menuItem) {
      logger.error("Menu item does not exist");
      throw new Meteor.Error(404, "Menu item does not exist");
    }
    var menuPreps = menuItem.jobItems;

    if(preps.length < 0) {
      logger.error("Preps should be an array of items");
      throw new Meteor.Error(404, "Preps should be an array of items");
    }

    preps.forEach(function(prep) {
      var exist = MenuItems.findOne(
        {"_id": menuId, "jobItems": {$elemMatch: {"_id": prep._id}}}, 
        {"fields": {"jobItems": {$elemMatch: {"_id": prep._id}}}});

      if(exist.jobItems[0]._id == prep._id) {
        if(exist.jobItems[0].quantity != prep.quantity) {
          MenuItems.update({'_id': menuId, "jobItems": {$elemMatch: {"_id": prep._id}}}, 
            {$set: {'jobItems.$.quantity': prep.quantity}});   
        }
      } else {
        MenuItems.update({'_id': menuId}, 
          {$push: {'jobItems': prep}});  
      }
    });
    logger.info("Preps updated for menu item", menuId);
    return;
  },

  'createCategory': function(name) {
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
    if(!name) {
      logger.error("Category should have a name");
      return new Meteor.Error(404, "Category should have a name");
    }
    var exist = Categories.findOne({"name": name});
    if(exist) {
      logger.error('Category name should be unique', exist);
      throw new Meteor.Error(404, "Category name should be unique");
    }
    return Categories.insert({"name": name});
  },

   'createStatus': function(name) {
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
    if(!name) {
      logger.error("Status should have a name");
      return new Meteor.Error(404, "Status should have a name");
    }
    var exist = Statuses.findOne({"name": name});
    if(exist) {
      logger.error('Status name should be unique', exist);
      throw new Meteor.Error(404, "Status name should be unique");
    }
    return Statuses.insert({"name": name.toLowerCase()});
  },

  menuItemsCount: function() {
    return MenuItems.find().count();
  },

  duplicateMenuItem: function(id) {
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
    var exist = MenuItems.findOne(id);
    if(!exist) {
      logger.error('Menu should exist to be duplicated');
      throw new Meteor.Error(404, "Menu should exist to be duplicated");
    }
    var filter = new RegExp(exist.name, 'i');
    var count = MenuItems.find({"name": filter}).count();

    var duplicate = {
      "name": exist.name + " - copy " + count,
      "category": exist.category,
      "instructions": exist.instructions,
      "ingredients": exist.ingredients,
      "jobItems": exist.prepItems,
      "salesPrice": parseFloat(exist.salesPrice),
      "image": exist.image,
      "createdOn": Date.now(),
      "createdBy": userId,
      "status": exist.status
    };

    var id = MenuItems.insert(duplicate);
    logger.info("Menu items added ", id);
    return id;
  }
});