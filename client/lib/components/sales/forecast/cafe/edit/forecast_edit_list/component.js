var component = FlowComponents.define("cafeSalesForecastEditList", function(props) {
});

component.state.forecastPerWeek = function() {
  var weekForecast = ForecastCafe.find();
  return weekForecast;
}

component.state.expectedTotalRevenue = function() {
  var weekForecast = ForecastCafe.find().fetch();
  var total = 0;
  if(weekForecast.length > 0) {
    weekForecast.forEach(function(item) {
      total += item.revenue;
    });
  }
  return total;
}