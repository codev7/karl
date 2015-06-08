var component = FlowComponents.define('ingredientItemEdit', function(props) {
  this.ingredient = props.ingredient;
  var item = getIngredientItem(this.ingredient._id);
  this.ingredient = item;
  this.ingredient.quantity = props.ingredient.quantity;
});

component.state.id = function() {
  return this.ingredient._id;
}

component.state.code = function() {
  return this.ingredient.code;
}

component.state.description = function() {
  return this.ingredient.description;
}

component.state.portionUsed = function() {
  return this.ingredient.portionUsed;
}

component.state.costPerPortionUsed = function() {
  return this.ingredient.costPerPortionUsed;
}

component.state.quantity = function() {
  if(this.ingredient.quantity) {
    return this.ingredient.quantity;
  } else {
    return 1;
  }
}