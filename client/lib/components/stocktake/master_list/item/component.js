var component = FlowComponents.define("stocktakeItem", function(props) {
  this.item = props.item;
});

component.state.item = function() {
  return this.item;
}