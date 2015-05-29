Template.ingredientItemDetailed.events({
  'click .editIngredient': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  }
});

Template.ingredientItemDetailed.rendered = function() {
  // $('[data-toggle="tooltip"]').tooltip();
}