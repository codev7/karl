var component = FlowComponents.define("salesItemsListedCali", function(props) {
  this.menu = props.menu;
  var menuItem = MenuItems.findOne(this.menu._id);
  if(menuItem) {
    this.menu.name = menuItem.name;
    this.menu.salesPrice = menuItem.salesPrice;
  }
});

component.state.id = function() {
  return this.menu._id;
}

component.state.name = function() {
  return this.menu.name;
}

component.state.qty = function() {
  return this.menu.quantity;
}

component.state.revenue = function() {
  var total = this.menu.quantity * this.menu.salesPrice;
  return total;
}