Meteor.publish("salesOnDate", function(date) {
  var cursors = [];
  var salesCursor = Sales.find({"date": date});
  cursors.push(salesCursor);
  return cursors;
});

Meteor.publish("salesOnDateRange", function(range) {
  var todayInMiliSecs = new Date().getTime();
  var dateRange = parseInt(range) * 24 * 60 * 60 * 1000;
  var calcMiliSecs = todayInMiliSecs + dateRange;


  var historyDate = new Date(calcMiliSecs).toJSON().slice(0, 10);
  var today = new Date().toJSON().slice(0, 10);
  
  console.log("........historyDate.....", historyDate, today);

  var pipeline = [
    {$group: {"menu": "$menuItem", "soldAtPrice": "$soldAtPrice", "totalQty": {$sum: "$quantity"}}}
  ]
  var sales = Sales.aggregate(pipeline);
  return sales;
});