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
    console.log(revenues);
    if(revenues.length > 0) {
      revenues.forEach(function(item) {
        if(item.revenue > 0) {
          Meteor.call("generateForecastForDay", item.revenue, function(err, result) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } else {
              console.log("....item " + item.day + ".....", result);
              ForcastCafe.insert({"_id": item.day});
            }
          });
        }
      });
      Router.go("/sales/forecast/cafe/edit");
    }
  } 
});