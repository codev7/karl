Meteor.publish("salesOnDate", function(date) {
  var cursors = [];
  var salesCursor = Sales.find({"date": date});
  cursors.push(salesCursor);
  return cursors;
});

Meteor.publish("salesOnDateRange", function(range) {
  console.log(range);
  var cursors = [];
  var todayInMiliSecs = new Date().getTime();
  var dateRange = parseInt(range) * 24 * 60 * 60 * 1000;
  console.log("............", dateRange);
  var calcMiliSecs = todayInMiliSecs - dateRange;


  var historyDate = new Date(calcMiliSecs).toJSON().slice(0, 10);
  var today = new Date().toJSON().slice(0, 10);
  
  console.log("........historyDate.....", historyDate, today);

  var query = {"date": {$gte: historyDate, $lte: today}};
  var doc = Sales.find(query);
  var pipe = [
  {
    $match: {
      "dateRange": { $gte: {"$date": historyDate}}
    }
  },
  { $group: {
      _id: {"menuitem": "$menuItem"},
      qty: { $sum: "$quantity"}
    }
  }
]
  var sales = Sales.aggregate(pipe);
  var menuIds = [];
  if(sales && sales.length > 0) {
    sales.forEach(function(sale) {
      console.log("--------", sale);
      menuIds.push(sale._id);
    });
  }
  console.log(menuIds);
  var menuItems = MenuItems.find({"_id": {$in: menuIds}});
  var menuItemsFetched = menuItems.fetch();
  sales.forEach(function(sale) {
    menuItemsFetched.forEach(function(item) {
      if(sale._id == item._id) {
        item.totalQuantity = sale.totalQty;
      }
    });
  });
  // cursors.push(menuItems);
  console.log("---------", sales);
  return cursors;
});