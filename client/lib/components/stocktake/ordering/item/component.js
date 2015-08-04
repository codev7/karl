var component = FlowComponents.define("ordersListItem", function(props) {
  this.order = props.item;
});

component.state.order = function() {
  this.order.countNeeded = this.order.countOnHand + this.order.orderedCount;
  subs.subscribe("ingredients", [this.order.stockId]);
  var stock = Ingredients.findOne({"_id": this.order.stockId});
  if(stock) {
    this.order.stockName = stock.description;
  }
  return this.order;
}