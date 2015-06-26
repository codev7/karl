var component = FlowComponents.define('ingredientItemDetailed', function(props) {
  this.ingredient = props.ingredient;
});

component.state.item = function() {
  return this.ingredient;
};
