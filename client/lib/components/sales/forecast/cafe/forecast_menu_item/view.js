Template.forecastMenuItem.events({
  'click .removeSalesMenu': function(event) {
    event.preventDefault();
    $(event.target).parent().parent().remove();
  },

  'keypress .menuForecastQty': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      var qty = $(event.target).val();
      FlowComponents.callAction("keyup", qty);
      $(event.target).parent().parent().next().find("input").focus();
    }
  }
});