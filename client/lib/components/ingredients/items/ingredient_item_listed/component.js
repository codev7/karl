var component = FlowComponents.define('ingredientItemListed', function(props) {
  this.ingredient = props.ingredient;
});

component.state.code = function() {
  return this.ingredient.code;
}

component.state.id = function() {
  return this.ingredient._id;
}

component.state.description = function() {
  return this.ingredient.description;
}

component.state.portionUsed = function() {
  return this.ingredient.portionUsed;
}

component.state.costPerPortionUsed = function() {
  var costPerPortionUsed = 0;
  if((this.ingredient.costPerPortion > 0) && (this.ingredient.unitSize > 0)) {
    costPerPortionUsed = this.ingredient.costPerPortion/this.ingredient.unitSize;
    costPerPortionUsed = Math.round(costPerPortionUsed * 100)/100;
    if(costPerPortionUsed === 0) {
      costPerPortionUsed = 0.001;
    }
  }
  return costPerPortionUsed;
}