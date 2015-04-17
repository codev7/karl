var component = FlowComponents.define("salesCalibratedList", function(props) {  
  this.renderCaliberatedList();
});

component.action.click = function(range) {
  var self = this;
  var totalCount = 0;
  var totalCountedRevenue = 0;
  Meteor.call("calibratedSales", range, function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("list", result);
      result.forEach(function(item) {
        totalCount += item.quantity;
        var menuItem = MenuItems.findOne(item._id);
        totalCountedRevenue += item.quantity * menuItem.salesPrice;
      });
      self.set("menuItemsCount", totalCount);
      self.set("menuItemsRevenue", totalCountedRevenue);
    }
  });
}

component.state.calibratedList = function() {
  return this.get("list");
}

component.prototype.renderCaliberatedList = function() {
  var self = this;
  var totalCount = 0;
  var totalCountedRevenue = 0;
  Meteor.call("calibratedSales", 0, function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("list", result);
      result.forEach(function(item) {
        totalCount += item.quantity;
        var menuItem = MenuItems.findOne(item._id);
        totalCountedRevenue += item.quantity * menuItem.salesPrice;
      });
      self.set("menuItemsCount", totalCount);
      self.set("menuItemsRevenue", totalCountedRevenue);
    }
  });
}

component.state.totalItemCount = function() {
  return this.get("menuItemsCount");
}

component.state.totalRevenue = function() {
  return this.get("menuItemsRevenue");
}
