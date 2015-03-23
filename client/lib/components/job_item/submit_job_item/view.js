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
    var avgWagePerHour = $(event.target).find('[name=avgWagePerHour]').val().trim();
    var ing = $(event.target).find("[name=ing_qty]").get();
    var recipe = FlowComponents.child('jobItemEditorSubmit').getState('content');

    if(!name) {
      return alert("Name should have a value");
    } 
    if(!activeTime) {
      return alert("Should have an active time for the job");
    }
    
    if(recipe) {
      if($('.ql-editor').text() === "Add recipe here" || $('.ql-editor').text() === "") {
        recipe = ""
      }
    }
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
    if(!avgWagePerHour) {
      avgWagePerHour = 0;
    } else {
      avgWagePerHour = parseFloat(avgWagePerHour);
    }

    var info = {
      "name": name,
      "type": type,
      "portions": portions,
      "activeTime": activeTime,
      "shelfLife": shelfLife,
      "ing": [],
      "recipe": recipe,
      "wagePerHour": avgWagePerHour    
    }
    var ing_doc = [];
    var ingIds = [];
    ing.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && ingIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        if(quantity > 0) {
          var info = {
            "_id": dataid,
            "quantity": quantity
          }
          ing_doc.push(info);
          ingIds.push(dataid);
        }
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