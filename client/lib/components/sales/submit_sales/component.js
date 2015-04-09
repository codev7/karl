var component = FlowComponents.define("submitSales", function(props) {
});

component.state.todaysDate = function() {
  var date = moment(new Date()).format("YYYY-MM-DD");
  // var date = this.get("date");
  return date;
}

component.state.saleMenuList = function() {
}