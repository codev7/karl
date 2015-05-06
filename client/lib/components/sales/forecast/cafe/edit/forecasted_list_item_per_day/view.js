Template.forecastedListItemPerDay.events({
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

        var obj = {
          "quantity": parseInt(value),
          "_id": id
        }
        doc.push(obj);
      });
      ForecastCafe.update({"_id": day}, {$set: {"selected": doc}});
      return;
    }
  }
});