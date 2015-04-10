var subs = new SubsManager();

var component = FlowComponents.define("salesList", function(props) {
  if(props.list == "listOnRange") {
    this.renderedListOnRange();
    this.set("range", props.range);
  } else {
    // subs.subscribe("salesOnDate", props.date);
    this.set("date", props.date);
  }
});

component.state.salesMenusList = function() {
  var sales = null;
  if(this.get("date")) {
    sales = Sales.find({"date": this.get("date")}).fetch();
  } else {
    var range = this.get("range");
    
    sales = MenuItems.find().fetch();
    console.log(sales);
  }
  return sales;
}

component.prototype.renderedListOnRange = function() {
  // subs.subscribe("salesOnDateRange", parseInt(Session.get("daysRangeCount")));
}