Template.ingredientItemDetailed.events({
  'click .editIngredient': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisIngredientId", id);
  },

  'click .deleteIngredient': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var result = confirm("Are you sure, you want to delete this item ?");
    if (result == true) {
      Meteor.call("deleteIngredient", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
        IngredientsListSearch.cleanHistory();
        IngredientsListSearch.search("", {"limit": 10});
      });
    }
  }
});

Template.ingredientItemDetailed.rendered = function() {
  // $('[data-toggle="tooltip"]').tooltip();
}