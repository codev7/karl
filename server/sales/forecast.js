Meteor.methods({
  'generateForecastForDay': function(revenue) {
    if(!Meteor.userId()) {
      logger.error('No user has logged in');
      throw new Meteor.Error(401, "User not logged in");
    }
    var userId = Meteor.userId();
    var permitted = isManagerOrAdmin(userId);
    if(!permitted) {
      logger.error("User not permitted to create ingredients");
      throw new Meteor.Error(404, "User not permitted to create ingredients");
    }

    var pipe = [ 
      { $group: {
          _id: "$date", 
          "revenueGained": {
            "$sum": {
              "$multiply": ["$soldAtPrice", "$quantity"]
            }
          }
        }
      },
      { $match: {revenueGained: revenue}},
      { $sort: { "_id": -1 }}
    ]
    var sales = Sales.aggregate(pipe, {cursor: { batchSize: 0 }});
    console.log("...........", sales);
    return sales;

  }
});