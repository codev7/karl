var component = FlowComponents.define("listedMenuItem", function(props) {
  this.menu = props.menu;
});

component.state.name = function() {
  return this.menu.name;
}

component.state.id = function() {
  return this.menu._id;
}

component.state.salesPrice = function() {
  return this.menu.salesPrice;
}