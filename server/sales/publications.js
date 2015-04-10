Meteor.publish("salesOnDate", function(date) {
  var cursors = [];
  var salesCursor = Sales.find({"date": date});
  cursors.push(salesCursor);
  return cursors;
});

Meteor.publish("salesOnDateRange", function(range) {
  console.log(range);
  var todayInMiliSecs = new Date().getTime();
  var dateRange = parseInt(range) * 24 * 60 * 60 * 1000;
  console.log("............", dateRange);
  var calcMiliSecs = todayInMiliSecs + dateRange;


  var historyDate = new Date(calcMiliSecs).toJSON().slice(0, 10);
  var today = new Date().toJSON().slice(0, 10);
  
  console.log("........historyDate.....", historyDate, today);

  var pipeline = [
    {$group: {_id: "$menuItem","totalQty": {$sum: "$quantity"}}}
  ]
  var sales = Sales.aggregate(pipeline);
  console.log("---------", sales)
  return sales;
});