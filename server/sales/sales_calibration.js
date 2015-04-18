Meteor.methods({
  'calibratedSales': function(range) {
    var dateRange = 0;
    if(parseInt(range) >= 0) {
      dateRange = parseInt(range);
    }
    var todayInMiliSecs = new Date().getTime();
    if(dateRange >= 0) {
      var dateRangeMili = parseInt(range) * 24 * 60 * 60 * 1000;
      var calcMiliSecs = todayInMiliSecs - dateRangeMili;

      var historyDate = new Date(calcMiliSecs).toJSON().slice(0, 10);
      var today = new Date().toJSON().slice(0, 10);

      var pipe = [{
          $match: {
            "date": { $gte: new Date(historyDate), $lte: new Date(today)}
          }
        },
        { $group: {
            _id: "$menuItem",
            quantity: { $sum: "$quantity"},
          }
        },
        { $sort: { quantity: -1 }}
      ]
      var sales = Sales.aggregate(pipe, {cursor: { batchSize: 0 }});
      if(sales.length > 0) {
        sales.forEach(function(sale) {
          var doc = MenuItems.findOne(
            {_id: sale._id}, 
            {fields: {name: 1, salesPrice: 1, category: 1, status: 1}}
          )
          sale['name'] = doc.name;
        });
        return sales;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
});