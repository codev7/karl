var component = FlowComponents.define("salesItemsListedCali", function(props) {
  this.menu = props.menu;
  var menuItem = MenuItems.findOne(this.menu._id);
  if(menuItem) {
    this.menu.name = menuItem.name;
  }
});

component.state.id = function() {
  return this.menu._id;
}

component.state.name = function() {
  return this.menu.name;
}

component.state.qty = function() {
  return this.menu.qty;
}