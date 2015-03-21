Template.editJobItem.helpers({
  item: function() {
    var id = Session.get("thisJobItem");
    var item = JobItems.findOne(id);
    return item;
  },

  ingredientsList: function() {
    var ing = Session.get("selectedIngredients");
    if(ing) {
      if(ing.length > 0) {
        Meteor.subscribe("ingredients", ing);
        var ingredientsList = Ingredients.find({'_id': {$in: ing}}).fetch();
        return ingredientsList;
      }
    }
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
    info.name = name.trim();
    info.type = type.trim();
    info.portions = parseInt(portions.trim());
    info.activeTime = parseInt(activeTime.trim());
    info.recipe = recipe;
    info.shelfLife = parseInt(shelfLife.trim());
    info.ingredients = [];

    if(!avgWagePerHour) {
      info.wagePerHour = 0;
    } else {
      info.wagePerHour = parseFloat(avgWagePerHour);
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