var component = FlowComponents.define("rosteredShifts", function(props) {
  this.set("id", props.id);
});

component.state.rosteredForShifts = function() {
  var id = this.get("id");
  var user = Meteor.users.findOne(id);
  if(user) {
    return Shifts.find({"assignedTo": id, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  }
}

component.state.openedShifts = function() {
  return Shifts.find({"assignedTo": null, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
}