var component = FlowComponents.define("cafeSalesForecastEditList", function(props) {
});

component.state.forecastPerWeek = function() {
  var weekForecast = ForecastCafe.find();
  return weekForecast;
}