Template.menuStep2Submit.helpers({
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
      if(menuItem.ingredients.length > 0) {
        menuItem.ingredients.forEach(function(item) {
          var ingItem = Ingredients.findOne(item.id);
          item.desc = ingItem.description;
          item.portionUsed = ingItem.portionUsed;
          item.unitPrice = parseInt(ingItem.costPerUnit)/parseInt(ingItem.unitSize);
          item.cost = (parseInt(ingItem.costPerUnit)/parseInt(ingItem.unitSize)) * parseInt(item.quantity);
          menuItem.totalIngCost += item.cost;
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