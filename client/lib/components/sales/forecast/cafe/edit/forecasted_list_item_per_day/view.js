Template.forecastedListItemPerDay.events({
  'change .forecastOption': function(event) {
    event.preventDefault();
    var date = $(event.target).val();
    if(date) {
      FlowComponents.callAction("change", date);
    }
  },

  'click .saveDailyForecast': function(event) {
    event.preventDefault();
    var menuItems = $(".menuForecastQty").get();
  }
});