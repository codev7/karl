Meteor.publish("salesOnDate", function(date) {
  var cursors = [];
  var salesCursor = Sales.find({"date": date});
  cursors.push(salesCursor);
  return cursors;
});

Meteor.publish("salesForecastOnDate", function(date) {
  var cursors = [];
  var salesCursor = SalesForecast.find({"date": date});
  cursors.push(salesCursor);
  return cursors;
});