var component = FlowComponents.define('menuItem', function(props) {
  this.menuitem = props.menuitem;
});

component.state.item = function() {
  return this.menuitem;
}

component.state.category = function() {
  if(this.menuitem.category) {
    var category = Categories.findOne(this.menuitem.category);
    if(category) {
      return category.name;      
    }
  }
}