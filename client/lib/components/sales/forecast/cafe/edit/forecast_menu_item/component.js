var component = FlowComponents.define("forecastMenuItem", function(props) {
  this.menu = props.menu;
  this.set("menuQuantity", this.menu.quantity);
});

component.state.name = function() {
  return this.menu.menuName;
} 

component.state.menuItem = function() {
  return this.menu.menuItem;
} 

component.state.id = function() {
  return this.menu._id;
}

component.state.quantity = function() {
  var qty = this.get("menuQuantity");
  return qty;
} 

component.state.itemRevenue = function() {
  var qty = this.get("menuQuantity");
  var menu = MenuItems.findOne(this.menu.menuItem);
  var revenue = 0;
  if(menu) {
    revenue = qty * menu.salesPrice;
  }
  return revenue;
}

component.action.keyup = function(qty) {
  this.set("menuQuantity", qty);
}