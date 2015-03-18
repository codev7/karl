Template.submitJobItem.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        Meteor.subscribe("ingredients", ing);
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

  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val().trim();
    var type = $(event.target).find('[name=type]').val();
    var portions = $(event.target).find('[name=portions]').val().trim();
    var activeTime = $(event.target).find('[name=activeTime]').val().trim();
    var shelfLife = $(event.target).find('[name=shelfLife]').val().trim();
    var ing = $(event.target).find("[name=ing_qty]").get();
    var recipe = FlowComponents.child('jobItemEditorSubmit').getState('content');

    if(!portions) {
      portions = 0;
    } else {
      portions = parseInt(portions);
    }
    if(!shelfLife) {
      shelfLife = 0;
    } else {
      shelfLife = parseInt(shelfLife);
    }
    console.log(recipe);

    var info = {
      "name": name,
      "type": type,
      "portions": portions,
      "activeTime": activeTime,
      "shelfLife": shelfLife,
      "ing": [],
      "recipe": recipe     
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
    FlowComponents.callAction('submit', info);
  }
});

Tracker.autorun(function() {
  if(Session.get("thisJobItem") == null) {
    return Meteor.subscribe("ingredients", []);
  }
});