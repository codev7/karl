Template.weeklyRosterDay.events({
  'click .addShiftBox': function(event) {
    var day = $(event.target).attr("data-day");
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    event.preventDefault();
    var doc = {
      "section": "Kitchen hand",
      "startTime": new Date().setHours(8, 0),
      "endTime": new Date().setHours(5, 0),
      "shiftDate": daysOfWeek.indexOf(day),
      "assignedTo": null,
    }
    LocalShifts.insert(doc);

    // initEditable();
    // mouseOverCrossToggle();
  }
});