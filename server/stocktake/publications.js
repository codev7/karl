Meteor.publish("allAreas", function() {
  var cursors = [];
  cursors.push(GeneralAreas.find());
  cursors.push(SpecialAreas.find());
  logger.info("All areas published");
  return cursors;
});

Meteor.publish("stocktakesOnDate", function(date) {
  logger.info("Stocktakes published for date ", date);
  var data = Stocktakes.find({"date": new Date(date).getTime()});
  return data;
});


Meteor.publish("ordersPlaced", function(date) {
  logger.info("Stock orders published for date ", date);
  var data = OrdersPlaced.find({"stocktakeDate": new Date(date).getTime()});
  console.log("............", data.fetch());
  return data;
});