var component = FlowComponents.define("weeklyShiftRoster", function(props) {});

component.state.week = function() {
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return daysOfWeek;
}