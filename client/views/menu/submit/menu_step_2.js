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
  },

  'click .removeIng': function(event) {
    event.preventDefault();
    var menuId = Session.get("thisMenuItem");
    var ingId = $(event.target).attr("data-id");
    Meteor.call("removeIngredients", menuId, ingId, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } 
    });
  }
});