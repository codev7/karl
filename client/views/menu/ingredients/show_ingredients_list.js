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
    // console.log(qty);
    var index = selectedIngredients.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedIngredients.push(item);
      }
    } else {
      if(!isChecked) {
        console.log("...remove.");
        selectedIngredients.splice(index, 1)
      } 
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    if(selectedIngredients.length > 0) {
      console.log("selectedIngredients", selectedIngredients);
      Session.set("selectedIngredients", selectedIngredients);
    }
    $("#ingredientsListModal").modal("hide");
  }
});