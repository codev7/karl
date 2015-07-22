var component = FlowComponents.define("clock", function(props) {
  Meteor.subscribe("daily", moment().format("YYYY-MM-DD"), Meteor.userId());
});

component.state.clockInPermission = function() {
  var query = {};
  var upplerLimit = new Date().getTime() + 2 * 3600 * 1000;
  var lowerLimit = new Date().getTime() - 2 * 3600 * 1000;
  query['assignedTo'] = Meteor.userId();
  query['status'] = 'draft';
  query['$and'] = [];
  query['$and'].push({"startTime": {$gte: lowerLimit}});
  query['$and'].push({"startTime": {$lte: upplerLimit}});
  var shift = Shifts.findOne(query, {sort: {"startTime": 1}});
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

component.state.subText = function() {
  var inshift = this.get("inShift");
  if(inshift && inshift.startTime <= Date.now()) {
    return "Today shift started ";
  } else {
    return "Today shift starts ";
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

// {"assignedTo": "Ly7CbgcYGBLatoW4k", 
// status: "draft",
// $and: [
//   {"startTime": $gte: 1437460183563},
//   {"startTime": $lte: 1437485383563}
// ]
// }
