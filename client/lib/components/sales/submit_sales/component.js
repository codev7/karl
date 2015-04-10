var component = FlowComponents.define("submitSales", function(props) {
  this.set("name", props.name);
  var date = Router.current().params.date;
  this.set("date", date);
});

component.state.todaysDate = function() {
  var date = this.get("date");
  return date;
}
component.state.todaysIsoDate = function() {
  return new Date(this.get("date"));
}