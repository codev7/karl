Template.menuStep2Submit.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        var ingredientsList = Ingredients.find({'_id': {$in: ing}});
        console.log(ingredientsList.fetch());
        return ingredientsList
      }
    }
  },

  jobItemsList: function() {
    var jobItems = Session.get("selectedJobItems");
    if(jobItems) {
      if(jobItems.length > 0) {
        var jobItemsList = JobItems.find({'_id': {$in: jobItems}}).fetch();
        jobItemsList.forEach(function(jobItem) {
          jobItem.cost = 0;
          jobItem.ingredients.forEach(function(doc) {
            var ing = Ingredients.findOne(doc.id);
            if(ing) {
              jobItem.cost += parseInt(ing.unitPrice) * parseInt(doc.quantity);
            }
          });
        });
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

  'click #addNewJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click #showJobItemsList': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("show");
  },

  'keyup .ing_qty': function(event, instance) {
    var qty = $($(event.target)[0]).val();
    var id = $(event.target).attr("data-id");
    Session.set("thisPrepItemQty", {"id": id, "qty": qty});
  },

  'click .viewIngredient': function(event) {
    event.preventDefault();
    Session.set("thisIngredient", this);
    $("#editIngredientModal").modal("show");
  },

  'submit form': function(event) {
    event.preventDefault();
    var menuId = Session.get("thisMenuItem");
    var preps = $(event.target).find("[name=prep_qty]").get();
    var ings = $(event.target).find("[name=ing_qty]").get();
    
    var ing_doc = [];
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      var quantity = $(item).val();
      var info = {
        "id": dataid,
        "quantity": quantity
      }
      ing_doc.push(info);
    });

    var prep_doc = [];
    preps.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      var quantity = $(item).val();
      var info = {
        "id": dataid,
        "quantity": quantity
      }
      prep_doc.push(info);
    });

    if(ing_doc.length > 0) {
      Meteor.call("addIngredients", menuId, ing_doc, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    } 

    if(prep_doc.length > 0) {
      Meteor.call("addJobItems", menuId, prep_doc, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
    Router.go("menuMaster");
  }
});