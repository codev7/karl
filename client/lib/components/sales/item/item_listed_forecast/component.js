var component = FlowComponents.define("itemListedForecast", function(props) {
  this.menu = props.menu;
  var menu = MenuItems.findOne(this.menu._id);
  this.menu.salesPrice = menu.salesPrice;
});

component.action.keyup = function(id, portions, event) {
  var forecast = ForecastCatering.findOne(id);
  if(forecast) {
    ForecastCatering.update({"_id": id}, {$set: {"expectedPortions": parseInt(portions)}});
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

component.state.portionsToBeSold = function() {
  return this.menu.expectedPortions;
}

component.state.expectedRevenue = function() {
  var expectedPortions = this.menu.expectedPortions;
  var revenue = parseFloat(expectedPortions * this.menu.salesPrice);
  if(!revenue && revenue < 0) {
    revenue = 0;
  } else {
    revenue = Math.round(revenue * 100)/100;
  }
  if(revenue == revenue) {
    if(revenue == Infinity) {
      return 0;
    } else {
      return revenue;
    }
  } else {
    return 0;
  }
}