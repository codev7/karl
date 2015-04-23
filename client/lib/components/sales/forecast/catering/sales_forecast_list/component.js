var component = FlowComponents.define("cateringSalesForecastList", function(props) {
  this.createForecastOnRendered();
});

component.state.forecastList = function() {
  var forecast = null;
  forecast = ForecastCatering.find();
  if(forecast) {
    return forecast;
  }
}

component.prototype.createForecastOnRendered = function() {
  var menuItems = MenuItems.find({"status": "active"}).fetch();
  menuItems.forEach(function(menu) {
    var forecastExist = ForecastCatering.findOne(menu._id);
    if(!forecastExist) {
      var doc = {
        "_id": menu._id,
        "name": menu.name,
        "expectedPortions": 0,
        "createdOn": new Date().getTime()
      }
      ForecastCatering.insert(doc);
    }
  });
}

component.state.totals = function() {
  var expectedTotalRevenue = 0;
  var expectedTotalPortions = 0;

  var forecasts = ForecastCatering.find().fetch();
  forecasts.forEach(function(item) {
    expectedTotalPortions += item.expectedPortions;
    var menuItem = MenuItems.findOne(item._id);
    var revenue = parseFloat(item.expectedPortions * menuItem.salesPrice);
    if(!revenue && revenue < 0) {
      revenue = 0;
    } else {
      revenue = Math.round(revenue * 100)/100;
    }
    if(revenue == revenue) {
      if(revenue == Infinity) {
        expectedTotalRevenue += 0;
      } else {
        expectedTotalRevenue += revenue;
      }
    }
  });
  return {
    "expectedTotalPortions": expectedTotalPortions, 
    "expectedTotalRevenue": expectedTotalRevenue
  };
}