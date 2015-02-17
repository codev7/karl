Template.ingredientsList.helpers({
  ingredientsList: function() {
    var list = Ingredients.find().fetch();
    return list;
  }
});