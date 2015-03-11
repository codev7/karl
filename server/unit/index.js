Meteor.methods({
  addUnitConvertion: function(unit, convertTo, count) {
    if(!unit || !unit.trim()) {
      logger.error("Unit field not found");
      throw new Meteor.Error(404, "Unit field not found");
    }
    if(!convertTo || !convertTo.trim()) {
      logger.error("Convertion field not found");
      throw new Meteor.Error(404, "Convertion field not found");
    }
    if(!count || !count.trim()) {
      logger.error("Count field not found");
      throw new Meteor.Error(404, "Count field not found");
    }
    var id = unit.trim() + "-" + convertTo.trim();
    var exist = Conversions.findOne(id);
    if(exist) {
      logger.error("Entry already exists in this id");
      throw new Meteor.Error(404, "Entry already exists in this id");
    }
    var info = {
      "_id": id,
      "count": parseFloat(count)
    }
    Conversions.insert(info);
    logger.info("Inserted new Converion", id);
  }
});