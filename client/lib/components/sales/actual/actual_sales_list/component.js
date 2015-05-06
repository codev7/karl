var component = FlowComponents.define("actualSalesList", function(props) {
  var date = Router.current().params.date;
  this.set("date", date);
});