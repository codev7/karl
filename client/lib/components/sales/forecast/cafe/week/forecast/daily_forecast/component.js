var component = FlowComponents.define("dailyForecast", function(props) {
  this.day = props.day;
});

component.state.day = function() {
  var day = this.day.date;
  return moment(day).format("dddd MM-Do");
}

component.state.expectedRevenue = function() {
  return this.day.expectedRevenue;
}

component.state.id = function() {
  return this.day._id;
}