Template.weeklyRosterDay.events({
  'click .addShiftBox': function(event) {
    var day = $(event.target).attr("data-day");
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    event.preventDefault();
    var doc = {
      "section": "Kitchen hand",
      "startTime": new Date().setHours(8, 0),
      "endTime": new Date().setHours(17, 0),
      "shiftDate": new Date(daysOfWeek.indexOf(day)),
      "assignedTo": null,
    }
    Meteor.call("createTemplateShift", doc, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});