var component = FlowComponents.define('ingredientItemEdit', function(props) {
  this.ingredient = props.ingredient;
  var item = getIngredientItem(this.ingredient._id);
  this.ingredient = item;
  this.ingredient.quantity = props.ingredient.quantity;
});

component.state.item = function() {
  return this.ingredient;
}

component.state.quantity = function() {
  if(this.ingredient.quantity) {
    return this.ingredient.quantity;
  } else {
    return 1;
  }
}