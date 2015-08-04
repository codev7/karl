var component = FlowComponents.define("ordersList", function(props) {
});

component.state.list = function() {
  return OrdersPlaced.find({
    "stocktakeDate": Session.get("thisDate"),
    "supplier": Session.get("activeSupplier")
  });
}
