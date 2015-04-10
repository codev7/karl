var component = FlowComponents.define("submitSales", function(props) {
});

component.state.todaysDate = function() {
  var date = moment(new Date()).format("YYYY-MM-DD");
  return date;
}
component.state.todaysIsoDate = function() {
  var date = moment(new Date()).format("YYYY-MM-DD");
  return new Date(date);
}

component.state.saleMenuList = function() {
}