Meteor.publish("salesOnDate", function(date) {
  var cursors = [];
  var salesCursor = Sales.find({"date": date}, {limit: 10});
  cursors.push(salesCursor);
  return cursors;
});

Meteor.publish("salesForecastOnDate", function(date) {
  var cursors = [];
  var salesCursor = SalesForecast.find({"date": date}, {limit: 10});
  cursors.push(salesCursor);
  return cursors;
});


Meteor.publish("salesCalibration", function(date) {
  var cursors = [];
  cursors.push(SalesCalibration.find());
  return cursors;
});

Meteor.publish("forecastPerWeek", function(firstDate, lastDate) {
  var firstDate = firstDate;
  var lastDate = lastDate;
  var cursors = [];
  var query = {"date": {$gte: firstDate, $lte: lastDate}};
  var forecast = ForecastCafe.find(query, {sort: {"date": 1}});
  cursors.push(forecast);
  logger.info("Forecast per week publication");
  return cursors;
});
