var component = FlowComponents.define("shiftBasic", function(props) {
  this.shift = props.shift;
});

component.state.shift = function() {
  return this.shift;
}