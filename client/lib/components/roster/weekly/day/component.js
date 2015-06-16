var component = FlowComponents.define("weeklyRosterDay", function(props) {
  this.name = props.name;
});

component.state.name = function() {
  return this.name;
}