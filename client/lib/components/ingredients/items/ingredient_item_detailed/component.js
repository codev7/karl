var component = FlowComponents.define('ingredientItemDetailed', function(props) {
  this.ingredient = props.ingredient;
});

component.state.id = function() {
  return this.ingredient._id;
};

component.state.code = function() {
  return this.ingredient.code;
};

component.state.unitSize = function() {
  return this.ingredient.unitSize;
};

component.state.description = function() {
  return this.ingredient.description;
};

component.state.costPerPortion = function() {
  return this.ingredient.costPerPortion;
};

component.state.portionOrdered = function() {
  return this.ingredient.portionOrdered;
};

component.state.portionUsed = function() {
  return this.ingredient.portionUsed;
};

component.state.suppliers = function() {
  return this.ingredient.suppliers;
};
