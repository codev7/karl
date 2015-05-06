Template.itemListedForecast.events({
  'keypress .portions': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var id = $(event.target).attr("data-id");
      var portionsToBeSold = $(event.target).val().trim();
      FlowComponents.callAction("keyup", id, portionsToBeSold, event);
    }
  }
});