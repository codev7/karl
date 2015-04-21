var component = FlowComponents.define("itemListedForecast", function(props) {
  this.menu = props.menu;
  var menu = MenuItems.findOne(this.menu._id);
  this.menu.salesPrice = menu.salesPrice;
});

component.action.keyup = function(id, revenue, event) {
  var forecast = Forecast.findOne({"menuItems": {$elemMatch: {"_id": id}}});
  if(forecast) {
    Forecast.update(
      {"menuItems": {$elemMatch: {"_id": id}}},
      {$set: { "menuItems.$.expectedRevenue": parseFloat(revenue)}}
    );
  }
  $(event.target).parent().parent().next().find("input").focus();
  return;
}

component.state.name = function() {
  return this.menu.name;
}

component.state.price = function() {
  return this.menu.salesPrice;
}

component.state.id = function() {
  return this.menu._id;
}

component.state.expectedRevenue = function() {
  return this.menu.expectedRevenue;
}

component.state.portionsToBeSold = function() {
  var expectedRevenue = this.menu.expectedRevenue;
  var portions = parseFloat(expectedRevenue / this.menu.salesPrice);
  if(!portions && portions < 0) {
    portions = 0;
  } else {
    portions = Math.round(portions)
  }
  if(portions == portions) {
    return portions;
  } else {
    return 0;
  }
}