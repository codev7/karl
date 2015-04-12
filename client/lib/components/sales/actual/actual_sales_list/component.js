var component = FlowComponents.define("actualSalesList", function(props) {
  var date = Router.current().params.date;
  this.set("date", date);
});

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