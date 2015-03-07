Template.submitJobItem.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        var ingredientsList = Ingredients.find({'_id': {$in: ing}});
        return ingredientsList;
      }
    }
  }
});

Template.submitJobItem.events({
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

  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();;
    var portions = $(event.target).find('[name=portions]').val();;
    var activeTime = $(event.target).find('[name=activeTime]').val();
    var recipe = $(event.target).find('[name=recipe]').val();
    var shelfLife = $(event.target).find('[name=shelfLife]').val();
    var ing = $(event.target).find("[name=ing_qty]").get();
    console.log(ing);
    var info = {
      "name": name,
      "type": type,
      "portions": portions,
      "activeTime": activeTime,
      "recipe": recipe,
      "shelfLife": shelfLife,
      "ing": []      
    }
    var ing_doc = [];
    ing.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid) {
        var quantity = $(item).val();
        var info = {
          "id": dataid,
          "quantity": quantity
        }
        ing_doc.push(info);
      }
    });

    if(ing_doc.length > 0) {
      info.ingredients = ing_doc
    } 
    Meteor.call("createJobItem", info, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        var menuItem = Session.get("thisMenuItem");
        if(menuItem) {
          Router.go("menuItemSubmitStep2", {'_id': menuItem});
        } else {
          Router.go("jobItemsMaster");
        }
      }
    });
  }
});