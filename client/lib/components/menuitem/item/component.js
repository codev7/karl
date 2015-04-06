var component = FlowComponents.define('menuItem', function(props) {
  this.menuitem = props.menuitem;
});

component.state.id = function() {
  return this.menuitem._id;
}

component.state.name = function() {
  return this.menuitem.name;
}

component.state.image = function() {
  return this.menuitem.image;
}

component.state.category = function() {
  if(this.menuitem.category) {
    var category = Categories.findOne(this.menuitem.category);
    if(category) {
      return category.name;      
    }
  }
}