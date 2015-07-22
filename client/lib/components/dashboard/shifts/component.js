var component = FlowComponents.define("shiftsSummary", function(props) {
  this.onRendered(this.onListRendered);
});

component.prototype.onListRendered = function() {
  var state = Session.get("shiftState");
  if(state == "future") {
    $(".futureShifts").addClass("label-primary");
  } else if(state == "past") {
    $(".pastShifts").addClass("label-primary");
  } else if(state == "open") {
    $(".openShifts").addClass("label-primary");
  }
}

component.state.shifts = function() {
  var state = Session.get("shiftState");
  var shifts = [];
  if(state == "future") {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$gte: Date.now()}}, {sort: {'shiftDate': 1}});
  } else if(state == "past") {
    var today = moment().format("YYYY-MM-DD");
    shifts = Shifts.find({
      "assignedTo": Meteor.userId(), 
      "shiftDate": {$lte: new Date(today).getTime()},
    }, {sort: {'shiftDate': -1}});
  } else if(state == "open") {
    shifts = Shifts.find({"assignedTo": null, "shiftDate": {$gte: Date.now()}}, {sort: {'shiftDate': 1}});
  }
  return shifts;
}

component.state.past = function() {
  var state = Session.get("shiftState");
  if(state == "past") {
    return true;
  } else {
    return false;
  }
}

component.state.shiftsCount = function() {
  var state = Session.get("shiftState");
  var shifts = [];
  if(state == "future") {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$gte: Date.now()}}).fetch();
  } else if(state == "past") {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$lt: Date.now()}}).fetch();
  } else if(state == "open") {
    shifts = Shifts.find({"assignedTo": null, "shiftDate": {$gte: Date.now()}}, {sort: {'shiftDate': 1}}).fetch();
  }
  if(shifts.length > 0) {
    return true;
  } else {
    return false;
  }
}
