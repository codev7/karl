Template.teamHours.events({
  'click .shiftView': function(event) {
    var week = Router.current().params.week;
    Session.set("reportHash", "shifts");
    Router.go("teamHours", {"week": week}, {hash: 'shifts'});
  },

  'click .hoursView': function(event) {
    var week = Router.current().params.week;
    Session.set("reportHash", "hours");
    Router.go("teamHours", {"week": week}, {hash: 'hours'});
  }
});