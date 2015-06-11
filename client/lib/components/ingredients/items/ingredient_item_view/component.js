var component = FlowComponents.define('ingredientItemView', function(props) {
  this.ingredient = props.ingredient;
  this.set("id", this.ingredient._id);
});

component.state.ing = function() {
  var id = this.get("id");
  if(id) {
    var item = getIngredientItem(id);
    if(item) {
      this.set("ing", item);
      return item;
    }
  }
}

component.state.quantity = function() {
  if(this.ingredient && this.ingredient.quantity) {
    return this.ingredient.quantity;
  }
}

component.state.cost = function() {
  var ing = this.get("ing");
  if(ing) {
    var cost = ing.costPerPortionUsed * this.ingredient.quantity;
    cost = Math.round(cost * 100)/100;
    return cost;
  }
}