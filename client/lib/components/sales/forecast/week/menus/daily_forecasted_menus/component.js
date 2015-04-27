var component = FlowComponents.define("dailyForecastedMenus", function(props) {
  this.forecast = props.forecast;
});

component.state.day = function() {
  var date = this.forecast.date;
  return moment(date).format("dddd MM-Do");
}

component.state.id = function() {
 return this.forecast._id; 
}

component.state.revenue = function() {
  return this.forecast.expectedRevenue;
}

component.state.listOfSalesItems = function() {
  return this.forecast.menus;
}