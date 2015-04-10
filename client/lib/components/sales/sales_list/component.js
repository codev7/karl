var subs = new SubsManager();

var component = FlowComponents.define("salesList", function(props) {
  if(props.list == "listOnRange") {
    subs.subscribe("salesOnDateRange", parseInt(Session.get("daysRangeCount")));
  } else {
    subs.subscribe("salesOnDate", props.date);
    this.set("date", props.date);
  }
});


component.state.salesMenusList = function() {
  var sales = Sales.find({"date": this.get("date")}).fetch();
  return sales;
}