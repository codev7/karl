var component = FlowComponents.define("clock", function(props) {});

component.state.clockInPermission = function() {
  var query = {};
  var upplerLimit = new Date().getTime() + 5 * 3600 * 1000;
  var lowerLimit = new Date().getTime() - 2 * 3600 * 1000;
  query['assignedTo'] = Meteor.userId();
  query['status'] = 'draft';
  query['$and'] = [
    {"startTime": {$gte: lowerLimit}},
    {"startTime": {$lte: upplerLimit}}
  ]
  var shift = Shifts.findOne(query, {sort: {"startTime": 1}, limit: 1});
  this.set("inShift", shift)
  if(shift) {
    return true;
  } else {
    return false;
  }
}

component.state.clockOutPermission = function() {
  var query = {};
  query['assignedTo'] = Meteor.userId();
  query['status'] = 'started';
  var shift = Shifts.findOne(query);
  this.set("outShift", shift);
  if(shift) {
    return true;
  } else {
    return false;
  }
}

component.state.clockIn = function() {
  var shift = this.get("inShift");
  if(shift) {
    return shift;
  }
}

component.state.clockOut = function() {
  var shift = this.get("outShift");
  if(shift) {
    return shift;
  }
}

component.state.shiftEnded = function() {
  var shiftId = Session.get("newlyEndedShift");
  var shift = Shifts.findOne(shiftId);
  if(shift) {
    return shift;
  }
}