Template.cafeSalesForecastList.events({
  'click .generateSalesForecast': function(event) {
    event.preventDefault();
    var expectedRevenue = $(".expectedRevenue").val();
    console.log("............", expectedRevenue);
    Meteor.call("generateForecastForDay", expectedRevenue, function(err, result) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        console.log("-----------", result);
      }
    });
  } 
});