Template.teamHours.events({
  'click .shiftView': function(event) {
    document.getElementById("showall_hideempty").innerText="Show All";
    var week = Router.current().params.week;
    Session.set("reportHash", "shifts");
    Router.go("teamHours", {"week": week}, {hash: 'shifts'});
  },

  'click .hoursView': function(event) {
    document.getElementById("showall_hideempty").innerText="Show All";
    var week = Router.current().params.week;
    Session.set("reportHash", "hours");
    Router.go("teamHours", {"week": week}, {hash: 'hours'});
  },
  'click .showallView': function(event) {
    var week = Router.current().params.week;
    var hash = Session.get("reportHash");
    if(hash=="shifts") {
      document.getElementById("showall_hideempty").innerHTML="Hide Empty";
      Session.set("reportHash", "shiftsall");
      Router.go("teamHours", {"week": week}, {hash: 'shiftsall'});
    }
    else if(hash=="hours") {
      document.getElementById("showall_hideempty").innerText="Hide Empty";
      Session.set("reportHash", "hoursall");
      Router.go("teamHours", {"week": week}, {hash: 'hoursall'});
    }else if(hash=="shiftsall") {
      document.getElementById("showall_hideempty").innerText="Show All";
      Session.set("reportHash", "shifts");
      Router.go("teamHours", {"week": week}, {hash: 'shifts'});
    }else if(hash=="hoursall") {
      document.getElementById("showall_hideempty").innerText="Show All";
      Session.set("reportHash", "hours");
      Router.go("teamHours", {"week": week}, {hash: 'hours'});
    }
  }
});
