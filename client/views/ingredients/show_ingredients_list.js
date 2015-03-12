Template.showIngredientsList.helpers({
  ingredientsList: function() {
    var list = Ingredients.find().fetch();
    return list;
  },
});

Template.showIngredientsList.events({
  'submit form': function(event) {
    event.preventDefault();
    var ing_items = $(event.target).find("[name=selectedIng]").get();
    var ing_items_doc = [];
    ing_items.forEach(function(ing) {
      var dataid = $(ing).attr("data-id");
      var check = $(ing).is(':checked');
      if(dataid && check) {
        ing_items_doc.push(dataid);
      }
    });
    if(ing_items_doc.length > 0) {
      Session.set("selectedIngredients", ing_items_doc);
    } else {
      Session.set("selectedIngredients", null);
    }
    $("#ingredientsListModal").modal("hide");
  }
});