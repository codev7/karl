var subs = new SubsManager();

var component = FlowComponents.define("salesItemsListed", function(props) {
  this.menu = props.menu;
  console.log(this.menu);
  var menuItem = MenuItems.findOne(this.menu.menuItem);
  this.menu.name = menuItem.name;
});

component.state.name = function() {
  return this.menu.name;
}

component.state.qty = function() {
  return this.menu.quantity;
}