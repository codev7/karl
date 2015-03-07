selectedIngredients = [];
Template.ingredientItemListed.events({
  'click .selectedIng': function(event) {
    var item = $(event.target).attr("data-id");
    var qty = $(event.target).parent().parent().find("input[type=text]").val();
    var index = selectedIngredients.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedIngredients.push(item);
      }
    } else if(index >= 0) {
      if(!isChecked) {
        selectedIngredients.splice(index, 1)
      } 
    }
  }
});

Template.ingredientItemListed.helpers({
  costPerPortion: function() {
    return getIngredientItem(this._id).costPerPortion;
  }
});