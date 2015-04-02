Template.editJobItem.helpers({
  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        Meteor.subscribe("ingredients", ing);
        var ingredientsList = Ingredients.find({'_id': {$in: ing}}).fetch();
        return ingredientsList;
      }
    }
  },

  jobTypes: function() {
    return JobTypes.find().fetch();
  }
});

Template.editJobItem.events({
  'submit form': function(event) {
    event.preventDefault();
    var id = Session.get("thisJobItem");
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();;
    var portions = $(event.target).find('[name=portions]').val();;
    var activeTime = $(event.target).find('[name=activeTime]').val();
    var recipe = FlowComponents.child('jobItemEditorEdit').getState('content');
    var shelfLife = $(event.target).find('[name=shelfLife]').val();
    var ings = $(event.target).find("[name=ing_qty]").get();
    var avgWagePerHour = $(event.target).find('[name=avgWagePerHour]').val().trim();

    var info = {};
    if(recipe) {
      if($('.ql-editor').text() === "Add recipe here" || $('.ql-editor').text() === "") {
        recipe = ""
      }
    }
    if(!name) {
      return alert("Name should have a value");
    }
    if(!activeTime) {
      return alert("Should have an active time for the job");
    }
    info.recipe = recipe;
    info.name = name.trim();
    info.type = type;
    info.portions = parseInt(portions.trim());
    info.activeTime = parseInt(activeTime.trim());
    info.ingredients = [];

    avgWagePerHour = parseFloat(avgWagePerHour);
    if(!avgWagePerHour || typeof(avgWagePerHour) != "number") {
      info.wagePerHour =  0;
    } else {
      if(avgWagePerHour === NaN) {
        info.wagePerHour = 0;
      } else {
        info.wagePerHour = Math.round(avgWagePerHour * 100)/100;
      }
    }
    shelfLife = parseFloat(shelfLife)
    if(!shelfLife || typeof(shelfLife) != "number") {
      info.shelfLife =  0;
    } else {
      if(shelfLife === NaN) {
        info.shelfLife = 0;
      } else {
        info.shelfLife = Math.round(shelfLife * 100)/100;
      }
    }
    var ing_doc = [];
    var ingredientIds = [];
    ings.forEach(function(item) {
      var dataid = $(item).attr("data-id");
      if(dataid && ingredientIds.indexOf(dataid) < 0) {
        var quantity = $(item).val();
        if(quantity > 0) {
          var info = {
            "_id": dataid,
            "quantity": quantity
          }
          ing_doc.push(info);
          ingredientIds.push(dataid);
        }
      }
    });
    if(ing_doc.length > 0 && ingredientIds.length > 0) {
      info.ingredients = ing_doc;
      info.ingredientIds = ingredientIds;
    }
    FlowComponents.callAction('submit', id, info);
  },

  'click #showIngredientsList': function(event) {
    event.preventDefault();
    $("#ingredientsListModal").modal("show");
  },

  'click #addNewIngredient': function(event) {
    event.preventDefault();
    $("#addIngredientModal").modal('show');
  },
});

Template.editJobItem.rendered = function() {
  Session.set("selectedIngredients", null);
}