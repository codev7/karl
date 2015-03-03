Template.menuStep2Submit.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        var ingredientsList = Ingredients.find({'_id': {$in: ing}});
        return ingredientsList
      }
    }
  },

  jobItemsList: function() {
    var jobItems = Session.get("selectedJobItems");
    if(jobItems) {
      if(jobItems.length > 0) {
        var jobItemsList = JobItems.find({'_id': {$in: jobItems}});
        return jobItemsList
      }
    }
  },

  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      var menuItem = MenuItems.findOne(id)
      menuItem.totalIngCost = 0;
      menuItem.tax = 0;
      menuItem.contribution = 0; // calc this after adding preps
      if(menuItem.salesPrice) {
        menuItem.tax = (menuItem.salesPrice * 10)/100;
      }
      return menuItem;
    }
  },

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
  },

  'click .finishMenu': function(event) {
    Router.go("menuMaster");
  },

  'click #addNewJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click #showJobItemsList': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("show");
  }
});