Template.weeklyRosterDay.events({
  'click .addShiftBox': function(event) {
    event.preventDefault();
    var day = $(event.target).attr("data-day");
    if(day) {
      FlowComponents.callAction("addShift", day);
    }
  }
});
