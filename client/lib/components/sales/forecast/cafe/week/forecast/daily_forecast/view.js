Template.dailyForecast.events({
  'keypress .expectedRevenue': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {  
      event.preventDefault();
      var revenue = $(event.target).val();
      var id = $(event.target).attr("data-id");
      var forecast = ForecastCafe.findOne(id);
      if(forecast) {
        Meteor.call("updateForecast", id, revenue, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
      $(event.target).parent().parent().next().find("input").focus();
    }
  }
});