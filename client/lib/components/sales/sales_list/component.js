var subs = new SubsManager();

var component = FlowComponents.define("salesList", function(props) {
  subs.subscribe("salesOnDate", props.date);
  this.set("date", props.date);
});


component.state.salesMenusList = function() {
  var sales = Sales.find({"date": this.get("date")}).fetch();
  return sales;
}