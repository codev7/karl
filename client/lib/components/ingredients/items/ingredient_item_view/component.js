var component = FlowComponents.define('ingredientItemView', function(props) {
  this.ingredient = props.ingredient;
  var item = getIngredientItem(this.ingredient._id);
  this.ingredient = item;
  this.ingredient.quantity = props.ingredient.quantity;
});

component.state.code = function() {
  return this.ingredient.code;
}

component.state.description = function() {
  return this.ingredient.description;
}

component.state.quantity = function() {
  return this.ingredient.quantity;
}

component.state.portionUsed = function() {
  return this.ingredient.portionUsed;
}

component.state.cost = function() {
  var cost = this.ingredient.costPerPortionUsed * this.ingredient.quantity;
  cost = Math.round(cost * 100)/100;
  return cost
}