var component = FlowComponents.define("menuDetailWidgets", function(props) {
  this.item = props.item;
});

component.state.item = function() {
  return this.item;
}