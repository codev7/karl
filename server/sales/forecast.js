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
      // { $match: {"revenueGained": { $gte: revenue }}},
      { $group: {
          _id: "$date",
          revenueGained: { $sum: { $multiply: [ "$soldAtPrice", "$quantity" ] }},
        }
      },
      { $project: {
          "gain": {
            "$cond":[
              {"$gte": ["$revenueGained", revenue]},
              revenue,
              ["nadee"]

            ] 
            // "$cond": [
              // {"$eq": [ "$revenueGained", 1000 ]}, 100, 50 
            // ]
          }
        }
      }
      // { $sort: { revenueGained: -1 }},
      // { $limit : 10 }
    ]
    console.log("....................", JSON.stringify(pipe));
    var sales = Sales.aggregate(pipe, {cursor: { batchSize: 0 }});
    console.log("...........", sales);
    return sales;

  }
});