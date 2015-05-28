var component = FlowComponents.define("dailyForecastedMenus", function(props) {
  this.forecast = props.forecast;
});

component.state.day = function() {
  var date = this.forecast.date;
  return moment(date).format("dddd MM-Do");
}

component.state.id = function() {
 return this.forecast._id; 
}

component.state.revenue = function() {
  return this.forecast.expectedRevenue;
}

component.state.listOfSalesItems = function() {
  return this.forecast.menus;
}

component.state.totals = function() {
  var list = this.forecast.menus;
  var totals = {
    "portions": 0,
    "revenue": 0
  }
  list.forEach(function(item) {
    totals.portions += parseFloat(item.quantity);
    var menuItem = MenuItems.findOne(item._id);
    if(menuItem) {
      var revenue = parseFloat(item.quantity) * menuItem.salesPrice;
      totals.revenue += revenue;
    }
  });
  return totals;
}