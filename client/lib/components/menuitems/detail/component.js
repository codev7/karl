var component = FlowComponents.define('menuItemDetail', function(props) {
  this.id = Router.current().params._id;
  this.onRendered(this.onViewRendered);
});

component.state.menu = function() {
  this.menu = MenuItems.findOne(this.id);
  if(this.menu) {
    return this.menu;
  }
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

component.prototype.onViewRendered = function() {
  this.menu = MenuItems.findOne(this.id);
  Session.set("goBackMenu", null);
}

