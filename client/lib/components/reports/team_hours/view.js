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
  },
  'click .showallView': function(event) {
    var week = Router.current().params.week;
    var hash = Session.get("reportHash");
    if((hash=="shifts")||(hash=="shiftsall")) {
      Session.set("reportHash", "shiftsall");
      Router.go("teamHours", {"week": week}, {hash: 'shiftsall'});
    }
    else if((hash=="hours")||(hash=="hoursall")) {
      Session.set("reportHash", "hoursall");
      Router.go("teamHours", {"week": week}, {hash: 'hoursall'});
    }
  }
});