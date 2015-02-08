Meteor.publish("weeklySales", function(firstDate, lastDate) {
  var cursors = [];
  //Sales on a date range
  var salesCursor = Sales.find({"date": {$gte: firstDate, $lte: lastDate}});
  cursors.push(salesCursor);
  
  logger.info("Weekly sales publication");
  return cursors;
});