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

component.state.name = function() {
  return this.menu.name;
}

component.state.id = function() {
  return this.menu._id;
}

component.state.initialHTML = function() {
  if(this.menu) {
    if(this.menu.instructions) {
      return this.menu.instructions;
    } else {
      return "Add instructions here"
    }
  }
};

