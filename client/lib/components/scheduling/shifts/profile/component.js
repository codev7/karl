var component = FlowComponents.define("shiftProfile", function(props) {
});

component.state.date = function() {
  var id = this.get("id");
  var shift = Shifts.findOne(id);
  if(shift) {
    this.set("shift", shift);
    return shift.shiftDate;
  }
}

component.state.id = function() {
  var id = Session.get("thisShift");
  this.set("id", id);
  return id;
}

component.state.startTime = function() {
  var shift = this.get("shift");
  if(shift) {
    return moment(shift.startTime).format("h:mm A");
  }
}

component.state.endTime = function() {
  var shift = this.get("shift");
  if(shift) {
    return moment(shift.endTime).format("h:mm A");
  }
}