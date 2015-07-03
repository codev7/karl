var component = FlowComponents.define("shiftsSummary", function(props) {
  this.onRendered(this.onListRendered);
});

component.prototype.onListRendered = function() {
  var state = Session.get("shiftState");
  if(state) {
    $(".futureShifts").addClass("label-primary");
  } else {
    $(".pastShifts").addClass("label-primary");
  }
}

component.state.shifts = function() {
  var state = Session.get("shiftState");
  var shifts = [];
  if(state) {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$gte: Date.now()}}, {sort: {'shiftDate': 1}});
  } else {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$lt: Date.now()}}, {sort: {'shiftDate': -1}});
  }
  return shifts;
}

component.state.shiftsCount = function() {
  var state = Session.get("shiftState");
  var shifts = [];
  if(state) {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$gte: Date.now()}}).fetch();
  } else {
    shifts = Shifts.find({"assignedTo": Meteor.userId(), "shiftDate": {$lt: Date.now()}}).fetch();
  }
  if(shifts.length > 0) {
    return true;
  } else {
    return false;
  }
}

component.state.future = function() {
  return Session.get("shiftState");
}