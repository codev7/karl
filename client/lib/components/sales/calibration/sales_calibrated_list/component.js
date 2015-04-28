var component = FlowComponents.define("salesCalibratedList", function(props) {  
  this.renderCaliberatedList();
});

component.state.dateRange = function() {
  var range = this.get("range");
  if(range) {
    return range;
  } else {
    return 0;
  }
}

component.state.totalRevenue = function() {
  var revenue = this.get("revenue");
  if(revenue) {
    return revenue;
  } else {
    return 0;
  }
}

component.state.itemsList = function() {
  var list = this.get("list");
  if(list) {
    return list;
  }
}

component.prototype.renderCaliberatedList = function() {
  var list = SalesCalibration.findOne();
  if(list) {
    this.set("list", list.menus);
    this.set("range", list.range);
    this.set("revenue", list.revenue);
  } else {
    var menuItems = MenuItems.find({"status": "active"}).fetch();
    var items = [];
    if(menuItems.length > 0) {
      menuItems.forEach(function(item) {
        var obj = {
          "_id": item._id,
          "qty": 0
        }
        items.push(obj);
      });
    }
    this.set("list", items);
    this.set("range", 0);
    this.set("revenue", 0);
  }
}

component.action.keyup = function(value) {
  this.set("range", value);
}
