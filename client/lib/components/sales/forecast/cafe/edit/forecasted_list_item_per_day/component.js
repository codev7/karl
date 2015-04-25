var component = FlowComponents.define("forecastedListItemPerDay", function(props) {
  this.set("changed", false);
  this.forecast = props.forecast;
  this.set("day", this.forecast._id);
});

component.state.day = function() {
  return this.forecast._id;
}

component.state.revenue = function() {
  return this.forecast.revenue;
}

component.state.listOfSalesItems = function() {
  var forecast = this.forecast;
  var list = [];
  if(forecast.selected && forecast.selected.length > 0) {
    list = forecast.selected;
  } else {
    list = forecast.menus;
  }

  if(list.length > 0) {
    list.forEach(function(item) {
      var menu = MenuItems.findOne(item.menuItem);
      if(menu) {
        item.menuName = menu.name;
        item.currentRevenue = menu.salesPrice * item.quantity;
      }
    });
    return list;
  }
}
