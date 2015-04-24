var component = FlowComponents.define("forecastedListItemPerDay", function(props) {
  this.forecast = props.forecast;
  console.log(".......this.forecast.......", this.forecast);
  var date = this.forecast.relevantOnDates[0];
  this.loadListOfItems(date);
});

component.state.day = function() {
  return this.forecast._id;
}

component.state.revenue = function() {
  return this.forecast.revenue;
}

component.state.isNullForecastOptions = function() {
  if(this.forecast.relevantOnDates.length > 0) {
    return true;
  } else {
    return false;
  } 
}

component.state.forecastOptions = function() {
  var dates = this.forecast.relevantOnDates;
  if(dates.length >= 0) {
    var arr = [];
    dates.forEach(function(item) {
      var doc = {
        "option": dates.indexOf(item) + 1,
        "item": item
      }
      arr.push(doc);
    });
    return arr;
  } 
}


component.action.change = function(date) {
  this.loadListOfItems(date);
}

component.state.listOfSalesItems = function() {
  var list = this.get("salesList");
  if(list) {
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

component.prototype.loadListOfItems = function(date) {
  var self = this;
  Meteor.call("forecastedSales", date, function(err, sales) {
    if(err) {
      console.log(err);
    } else {
      self.set("salesList", sales);
      return;
    }
  });
}
