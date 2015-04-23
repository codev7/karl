Template.cafeSalesForecastPerDay.events({
  'keypress .expectedRevenue': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {  
      $(event.target).parent().parent().next().find("input").focus();
    }
  }
});