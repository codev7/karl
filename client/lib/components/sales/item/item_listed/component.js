var subs = new SubsManager();

var component = FlowComponents.define("salesItemsListed", function(props) {
  console.log("....................", props)
  this.menu = props.menu;
  var menuItem = MenuItems.findOne(this.menu.menuItem);
  if(menuItem) {
    this.menu.name = menuItem.name;
    this.menu.menuId = menuItem._id;
  }
});

component.state.id = function() {
  return this.menu._id;
}

component.state.menuId = function() {
  return this.menu.menuId;
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

component.action.keyup = function(id, menuId, qty, event) {
  var self = this;
  Meteor.call("editSalesMenuQuantity", id, menuId, qty, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      // self.find(event.target).focus();
      $(event.target).parent().parent().next().find("input").focus();
    }
  });
}