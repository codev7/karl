Template.ingredientItem.events({
  'click #editIngredient': function(event) {
    Session.set("thisIngredient", this);
    $("#editIngredientModal").modal("show");
  }
});