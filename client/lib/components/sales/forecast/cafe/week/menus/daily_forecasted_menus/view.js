Template.dailyForecastedMenus.events({
  'click .addMenuItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var forecastOfDay = ForecastCafe.findOne(id);
    if(forecastOfDay) {
      Session.set("menuAddForForecast", id);
      $("#showMenusList").modal();
    }
  }
});