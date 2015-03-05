Template.showIngredientsList.helpers({
  ingredientsList: function() {
    var list = Ingredients.find().fetch();
    return list;
  },
});

var selectedIngredients = [];
Template.showIngredientsList.events({
  'click .selectedIng': function(event) {
    var item = $(event.target).attr("data-id");
    var qty = $(event.target).parent().parent().find("input[type=text]").val();
    var index = selectedIngredients.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedIngredients.push(item);
      }
    } else {
      if(!isChecked) {
        selectedIngredients.splice(index, 1)
      } 
    }
    if(selectedIngredients.length > 0) {
      Session.set("selectedIngredients", selectedIngredients);
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("hide");
  }
});