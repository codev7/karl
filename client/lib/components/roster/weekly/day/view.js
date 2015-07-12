Template.weeklyRosterDay.events({
  'click .addShiftBox': function(event) {
    event.preventDefault();
    var day = $(event.target).attr("data-day");
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function(day) {
      if(day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    if(day) {
      FlowComponents.callAction("addShift", day, dates);
    }
  }
});
