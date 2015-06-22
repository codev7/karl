var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.name = props.name;
});

component.state.name = function() {
  return this.name;
}

component.state.shifts = function() {
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return TemplateShifts.find({"shiftDate": daysOfWeek.indexOf(this.name)});
}