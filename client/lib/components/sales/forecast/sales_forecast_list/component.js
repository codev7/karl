var component = FlowComponents.define("salesForecastList", function(props) {
  this.createForecastOnRendered();
});

component.state.forecastList = function() {
  var forecast = null;
  forecast = Forecast.find();
  if(forecast) {
    return forecast;
  }
}

component.prototype.createForecastOnRendered = function() {
  var menuItems = MenuItems.find({"status": "active"}).fetch();
  menuItems.forEach(function(menu) {
    var forecastExist = Forecast.findOne(menu._id);
    if(!forecastExist) {
      var doc = {
        "_id": menu._id,
        "name": menu.name,
        "expectedRevenue": 0,
        "createdOn": new Date().getTime()
      }
      Forecast.insert(doc);
    }
  });
}

component.state.totals = function() {
  var expectedTotalRevenue = 0;
  var expectedTotalPortions = 0;

  var forecasts = Forecast.find().fetch();
  forecasts.forEach(function(item) {
    expectedTotalRevenue += item.expectedRevenue;
    var menuItem = MenuItems.findOne(item._id);
    var portions = parseFloat(item.expectedRevenue / menuItem.salesPrice);
    if(!portions && portions < 0) {
      portions = 0;
    } else {
      portions = Math.round(portions)
    }
    if(portions == portions) {
      if(portions == Infinity) {
        expectedTotalPortions += 0;
      } else {
        expectedTotalPortions += portions;
      }
    }
  });
  return {"expectedTotalPortions": expectedTotalPortions, "expectedTotalRevenue": expectedTotalRevenue};
}