Template.menuStep2Submit.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var menuItem = MenuItems.findOne(id)
      if(menuItem.ingredients.length > 0) {
        menuItem.ingredients.forEach(function(item) {
          var ingItem = Ingredients.findOne(item.id);
          item.desc = ingItem.description;
          item.portionUsed = ingItem.portionUsed;
          item.cost = (parseInt(ingItem.costPerUnit)/parseInt(ingItem.unitSize)) * parseInt(item.quantity);
        });
      }
      return menuItem;
    }
  }
});

Template.menuStep2Submit.events({
  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  }
});