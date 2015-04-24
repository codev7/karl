Template.forecastedListItemPerDay.events({
  'change .forecastOption': function(event) {
    event.preventDefault();
    var date = $(event.target).val();
    if(date) {
      FlowComponents.callAction("change", date);
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    var day = $(event.target).attr("data-day");
    var forecast = ForecastCafe.findOne(day);
    if(forecast) {
      var doc = [];
      var qunatities = $(event.target).find('[name=forecastQty]').get();
      
      qunatities.forEach(function(item) {
        var value = $(item).val();
        var id = $(item).attr("data-id");
        var menuId = $(item).attr("data-menu");

        var obj = {
          "_id": id,
          "quantity": parseInt(value),
          "menuItem": menuId
        }
        doc.push(obj);
      });
      ForecastCafe.update({"_id": day}, {$set: {"selected": doc}});
      return;
    }
  }
});