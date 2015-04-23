var component = FlowComponents.define("weeklyForecastList", function(props) {
});

component.state.week = function() {
  var week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return week;
}
