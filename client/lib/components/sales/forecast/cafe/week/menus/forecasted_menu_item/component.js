var component = FlowComponents.define("forecastedMenuItem", function(props) {
  this.menu = props.menu;
  this.id = props.id;
  var qty = Math.round(this.menu.quantity);
  this.set("menuQuantity", this.menu.quantity);
  var menuItem = MenuItems.findOne(this.menu._id);
  if(menuItem) {
    this.menu.name = menuItem.name;
    this.menu.salesPrice = menuItem.salesPrice;
  }
});

component.state.name = function() {
  return this.menu.name;
}

component.state.quantity = function() {
  return this.get("menuQuantity")
}

component.state.itemRevenue = function() {
  var revenue = this.get("menuQuantity") * this.menu.salesPrice;
  revenue = Math.round(revenue);
  return revenue;
}

component.action.keyup = function(qty) {
  var forecast = ForecastCafe.findOne(this.id);
  if(forecast) {
    Meteor.call("updateForcastedMenus", this.id, this.menu._id, qty, function(err) {
      if(err) {
        console.log(err);
      }
    });
  }
  var qty = Math.round(qty);
  this.set("menuQuantity", qty);

}