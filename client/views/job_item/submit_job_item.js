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

  // 'click .removeIng': function(event) {
  //   event.preventDefault();
  //   var menuId = Session.get("thisMenuItem");
  //   var ingId = $(event.target).attr("data-id");
  //   Meteor.call("removeIngredients", menuId, ingId, function(err) {
  //     if(err) {
  //       console.log(err);
  //       return alert(err.reason);
  //     } 
  //   });
  // },

  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();;
    var portions = $(event.target).find('[name=portions]').val();;
    var activeTime = $(event.target).find('[name=activeTime]').val();
    var recipe = $(event.target).find('[name=recipe]').val();
    var shelfLife = $(event.target).find('[name=shelfLife]').val();
    var ing = $(event.target).find("[name=ing_qty]").get();

    if(typeof(portions) != "number") {
      portions = 0;
    }
    if(typeof(shelfLife) != "number") {
      shelfLife = 0;
    }
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
    var ingIds = [];
    ing.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && ingIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        var info = {
          "_id": dataid,
          "quantity": quantity
        }
        ing_doc.push(info);
        ingIds.push(dataid);
      }
    });

    if(ing_doc.length > 0) {
      info.ingredients = ing_doc;
    } 
    console.log(info);
    Meteor.call("createJobItem", info, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        Session.set("selectedIngredients", null);
        Session.set("selectedJobItems", null);
        Router.go("jobItemsMaster");
      }
    });
  }
});

Tracker.autorun(function() {
  if(Session.get("thisJobItem") == null) {
    return Meteor.subscribe("ingredients", []);
  }
});