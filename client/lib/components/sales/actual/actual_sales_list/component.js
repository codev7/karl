var subs = new SubsManager();

var component = FlowComponents.define("actualSalesList", function(props) {
  var date = Router.current().params.date;
  this.set("date", date);
  subs.subscribe("salesOnDate", new Date(date));
});

component.state.salesMenusList = function() {
  var sales = null;
  var date = this.get("date");
  if(date) {
    sales = Sales.find({"date": new Date(date)});
  } 
  return sales;
}

component.state.totals = function() {
  var totalQuantity = 0;
  var totalRevenue = 0;
  var sales = Sales.find({"date": new Date(this.get("date"))}).fetch();
  sales.forEach(function(doc) {
    totalQuantity += doc.quantity;
    var revenue = doc.quantity * doc.soldAtPrice;
    totalRevenue += revenue;
  });
  return {"totalItemCount": totalQuantity, "totalRevenue": totalRevenue};
}