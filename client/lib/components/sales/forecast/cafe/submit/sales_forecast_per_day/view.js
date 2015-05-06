Template.cafeSalesForecastPerDay.events({
  'keypress .expectedRevenue': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {  
      var revenue = $(event.target).val();
      var day = $(event.target).attr("data-id");
      var forecast = ForecastCafe.findOne(day);
      if(forecast) {
        ForecastCafe.update({"_id": day}, {$set: {"revenue": parseFloat(revenue)}});
      }
      $(event.target).parent().parent().next().find("input").focus();
    }
  }
});