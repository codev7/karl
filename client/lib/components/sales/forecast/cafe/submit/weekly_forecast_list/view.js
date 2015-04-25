Template.weeklyForecastList.events({
  'click .generateSalesForecast': function(event) {
    event.preventDefault();
    var expectedRevenue = $(".expectedRevenue").get();
    var revenues = [];
    expectedRevenue.forEach(function(item) {
      var doc = {
        "day": $(item).attr("data-id"),
        "revenue": parseFloat($(item).val())
      }
      revenues.push(doc);
    });
    if(revenues.length > 0) {
      revenues.forEach(function(item) {
        if(item.revenue > 0) {
          var doc = {
            "revenue": item.revenue,
            "menus": []
          }
          Meteor.call("generateForecastForDay", item.revenue, function(err, result) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } else {
              doc.menus = result;
              ForecastCafe.update({"_id": item.day}, {$set: doc});
            }
          });
        }
      });
      Router.go("/sales/forecast/cafe/edit");
    }
  } 
});