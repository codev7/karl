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
    return Shifts.find({"shiftDate": new Date(date).getTime()});
  } else if(origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return TemplateShifts.find({"shiftDate": daysOfWeek.indexOf(this.name)});
  }
}

component.action.addShift = function(day) {
  if(this.origin == "weeklyroster") {
    var doc = {
      "section": "Kitchen hand",
      "startTime": new Date(day).setHours(8, 0),
      "endTime": new Date(day).setHours(17, 0),
      "shiftDate": moment(new Date(day)).format("YYYY-MM-DD"),
      "assignedTo": null,
    }

    Meteor.call("createShift", doc, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });

  } else if(this.origin == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
}

component.state.isTemplate = function() {
  if(this.origin == "weeklyrostertemplate") {
    return true; 
  } else {
    return false;
  }
}