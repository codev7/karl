Template.weekForecastView.events({
  'click .generateSalesForecast': function(event) {
    event.preventDefault();
    var week = Router.current().params.week;
    var forecasts = ForecastCafe.find().fetch();
    if(forecasts.length > 0) {
      forecasts.forEach(function(item) {
        if(item.expectedRevenue > 0) {
          Meteor.call("generateForecastForDay",item._id, item.expectedRevenue, function(err, result) {
            if(err) {
              console.log(err);
              if(err.reason == "You should add calibrated data first") {
                alert(err.reason);
                Router.go("salesCalibration");
              } else {
                return alert(err.reason);
              }
            }
          });
        }
      });
      Router.go("weeklySalesForecastMenusList", {"week": week});
    }
  } 
});