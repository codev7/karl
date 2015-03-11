Template.showIngredientsList.helpers({
  ingredientsList: function() {
    var list = Ingredients.find().fetch();
    return list;
  },
});

Template.showIngredientsList.events({
  'click .setIngListSession': function(event) {
    event.preventDefault();
    if(selectedIngredients.length > 0) {
      Session.set("selectedIngredients", selectedIngredients);
    }
    $("#ingredientsListModal").modal("hide");
  }
});