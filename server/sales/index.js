Meteor.methods({
  'createSales': function(sales, date) {
    if(!sales) {
      logger.error("Sales field does not exist");
      throw new Meteor.Error(404, "Sales field does not exist");
    }
    if(!date) {
      logger.error("Date field does not exist");
      throw new Meteor.Error(404, "Date field does not exist");
    }
    var doc = {
      "sales": sales,
      "date": date,
      "createdOn": new Date(),
      "createdBy": null
    }
    var id = Sales.insert(doc);
    logger.info("New sales entry created", {"id": id});
    return;

  },

  'editSales': function(id, date, sales) {
    if(!id) {
      logger.error("Sales id field does not exist");
      throw new Meteor.Error(404, "Sales id field does not exist");
    }
    var updateDoc = {};
    if(sales) {
      updateDoc.sales = sales;
    }
    if(date) {
      updateDoc.date = date;
    }
    if(Object.keys(updateDoc).length <= 0) {
      logger.error("Sales has nothing to be updated");
      throw new Meteor.Error(401, "Sales has nothing to be updated");
    }
    Sales.update({"_id": id}, {$set: updateDoc});
    logger.info("Sales entry updated ", {"id": id});
    return;
  }
});