Meteor.methods({
  createIngredients: function(info) {
    if(!info.code) {
      logger.error("Code field not found");
      throw new Meteor.Error(404, "Code field not found");
    }
    if(!info.description) {
      logger.error("Name field not found");
      throw new Meteor.Error(404, "Name field not found");
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
      "_id": info.code,
      "description": info.description,
      "suppliers": suppliers,
      "unitOrdered": info.unitOrdered,
      "unitSize": info.unitSize,
      "costPerUnit": info.costperUnit,
      "portionUsed": info.portionUsed
    }
    var id = Ingredients.insert(doc);
    logger.info("New ingredient inserted ", id);
    return id;
  }
});