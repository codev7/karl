Template.salesCalibratedList.events({
  'click .btnGo': function(event) {
    event.preventDefault();
    var range = $("#daysRange").val().trim();
    if(range) {
      range = parseInt(range);
      FlowComponents.callAction("click", range);
    }
  }
});

