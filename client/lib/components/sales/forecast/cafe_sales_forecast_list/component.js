var component = FlowComponents.define("cafeSalesForecastList", function(props) {
});

component.state.week = function() {
  var week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return week;
}
