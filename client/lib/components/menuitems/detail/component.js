var component = FlowComponents.define('menuItemDetail', function(props) {
  this.id = Router.current().params._id;
  this.menu = MenuItems.findOne(this.id);
});

component.state.instructions = function() {
  return this.menu.instructions;
}

component.state.preps = function() {
  return this.menu.jobItems;
}

component.state.ingredients = function() {
  return this.menu.ingredients;
}


