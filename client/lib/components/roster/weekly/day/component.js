var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.name = props.name;
  this.origin = props.origin;
});

component.state.name = function() {
  return this.name;
}

component.state.origin = function() {
  return this.origin;
}

component.state.isUserPermitted = function() {
  var user = Meteor.user();
  if(user.isAdmin || user.isManager) {
    return true;
  } else {
    return false;
  }
}

component.state.shifts = function() {
  var origin = this.origin;
  if(origin == "weeklyroster") {
    var week = Session.get("thisWeek");
    var date = this.name.date;
    return Shifts.find({"shiftDate": new Date(date).getTime(), "type": null});
  } else if(origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return Shifts.find({"shiftDate": daysOfWeek.indexOf(this.name), "type": "template"});
  }
}

component.action.addShift = function(day, dates) {
  var doc = {
    "assignedTo": null,
    "week": dates
  }
  if(this.origin == "weeklyroster") {
    doc.startTime = new Date(day).setHours(8, 0);
    doc.endTime = new Date(day).setHours(17, 0);
    doc.shiftDate = moment(new Date(day)).format("YYYY-MM-DD");
    doc.section = null;
    doc.type = null;
  } else if(this.origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    doc.startTime = new Date().setHours(8, 0);
    doc.endTime = new Date().setHours(17, 0);
    doc.shiftDate = new Date(daysOfWeek.indexOf(day));
    doc.section = "Kitchen hand";
    doc.type = "template";
  }

  Meteor.call("createShift", doc, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}

component.state.isTemplate = function() {
  if(this.origin == "weeklyrostertemplate") {
    return true; 
  } else {
    return false;
  }
}