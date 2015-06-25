var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.name = props.name;
  this.origin = props.origin;
  this.onRendered(this.onListRendered);
});

component.state.name = function() {
  return this.name;
}

component.state.origin = function() {
  return this.origin;
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

component.prototype.onListRendered = function() {
  var origin = this.origin;
  $(".sortable-list").sortable({
    "connectWith": ".sortable-list",
    receive: function(event, ui) {
      var id = $(ui.item[0]).attr("data-id");//shiftid
      var  newDate = $(this).attr("data-date")//date of moved list
      if(origin == "weeklyrostertemplate") {
        var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        newDate = parseInt(daysOfWeek.indexOf(newDate));
      }
      if(id && newDate) {
        if(origin == "weeklyroster") {
          Meteor.call("editShift", {"_id": id, "shiftDate": newDate}, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
          });
        } else if(origin == "weeklyrostertemplate") {
          Meteor.call("editTemplateShift", {"_id": id, "shiftDate": newDate}, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
          });
        }
      }
    }
  });
}