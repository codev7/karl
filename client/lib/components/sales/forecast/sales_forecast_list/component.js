var component = FlowComponents.define("salesForecastList", function(props) {
  this.createForecastOnRendered();
});

component.state.forecastList = function() {
  var forecast = null;
  forecast = Forecast.findOne();
  if(forecast) {
    return forecast.menuItems;
  }
}

component.prototype.createForecastOnRendered = function() {
  var existingForecast = Forecast.findOne();
  var menuItems = MenuItems.find({"status": "active"}).fetch();
  if(!existingForecast) {
    var doc = {
      "createdOn": new Date().getTime(),
      "menuItems": [],
      "menuItemIds": []
    }
    menuItems.forEach(function(item) {
      var menu = {
        "name": item.name,
        "_id": item._id,
        "expectedRevenue": 0
      }
      doc['menuItemIds'].push(item._id);
      doc["menuItems"].push(menu);
    });
    return Forecast.insert(doc);
  } else {
    if(menuItems.length != existingForecast.menuItemIds.length) {
      var doc = {
        "menuItems": [],
        "menuItemIds": []
      };
      Forecast.update({"_id": existingForecast._id}, {$set: doc});
      menuItems.forEach(function(item) {
        var menu = {
          "name": item.name,
          "_id": item._id,
          "expectedRevenue": 0
        }
        doc['menuItemIds'].push(item._id);
        doc["menuItems"].push(menu);
      });
      Forecast.update({"_id": existingForecast._id}, {$set: doc});
    }
    return;
  }
}