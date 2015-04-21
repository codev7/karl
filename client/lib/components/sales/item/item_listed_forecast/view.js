Template.itemListedForecast.events({
  'keypress .revenue': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var id = $(event.target).attr("data-id");
      var expectedRevenue = $(event.target).val().trim();
      FlowComponents.callAction("keyup", id, expectedRevenue, event);
    }
  }
});