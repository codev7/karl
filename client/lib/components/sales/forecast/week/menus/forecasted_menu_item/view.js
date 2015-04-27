Template.forecastedMenuItem.events({
  'click .removeSalesMenu': function(event) {
    event.preventDefault();
    FlowComponents.callAction("keyup", 0);
  },

  'keypress .menuForecastQty': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var qty = $(event.target).val();
      FlowComponents.callAction("keyup", qty);
      $(event.target).parent().parent().next().find("input").focus();
    }
  }
});