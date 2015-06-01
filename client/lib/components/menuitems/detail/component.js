var component = FlowComponents.define('menuItemDetail', function(props) {
  this.id = Router.current().params._id;
});

component.state.menu = function() {
  this.menu = MenuItems.findOne(this.id);
  return this.menu;
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

