var subs = new SubsManager();

var component = FlowComponents.define("salesItemsListed", function(props) {
  this.menu = props.menu;
  var menuItem = MenuItems.findOne(this.menu.menuItem);
  if(menuItem) {
    this.menu.name = menuItem.name;
  }
});

component.state.id = function() {
  console.log(this.menu);
  return this.menu._id;
}

component.state.name = function() {
  return this.menu.name;
}

component.state.qty = function() {
  return this.menu.quantity;
}

component.state.revenue = function() {
  var cost = this.menu.soldAtPrice * this.menu.quantity;
  return cost;
}