var subs = new SubsManager();

var component = FlowComponents.define("salesList", function(props) {
  subs.subscribe("salesOnDate", new Date(props.date));
  this.set("date", props.date);
});

component.state.salesMenusList = function() {
  var sales = null;
  var date = this.get("date");
  if(date) {
    sales = Sales.find({"date": new Date(date)});
  } 
  return sales;
}

component.state.totalItemCount = function() {
  var total = 0;
  var sales = Sales.find({"date": new Date(this.get("date"))}).fetch();
  sales.forEach(function(doc) {
    total += doc.quantity;
  });
  return total;
}

component.state.totalRevenue = function() {
  var total = 0;
  var sales = Sales.find({"date": new Date(this.get("date"))}).fetch();
  sales.forEach(function(doc) {
    var revenue = doc.quantity * doc.soldAtPrice;
    total += revenue;
  });
  return total;
}