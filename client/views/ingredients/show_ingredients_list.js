var ing_ids = [];
Template.showIngredientsList.helpers({
  ingredientsList: function() {
    if(Router.current()) {
      var routeName = Router.current().route.getName();
      if(routeName == "jobItemEdit") {
        var id = Session.get("thisJobItem");
        var item = JobItems.findOne(id);
        if(item) {
          if(item.ingredients.length > 0) {
            item.ingredients.forEach(function(doc) {
              if(ing_ids.indexOf(doc._id) < 0) {
                ing_ids.push(doc._id);
              }
            });
          }
        }
      } else if(routeName == "menuItemEdit") {
        var id = Session.get("thisMenuItem");
        var item = MenuItems.findOne(id);
        if(item) {
          if(item.ingredients.length > 0) {
            item.ingredients.forEach(function(doc) {
              if(ing_ids.indexOf(doc._id) < 0) {
                ing_ids.push(doc._id);
              }
            });
          }
        }
      } else {
        ing_ids = [];
      }   
    }
    var list = Ingredients.find({"_id": {$nin: ing_ids}}).fetch();
    return list;
  },
});

Template.showIngredientsList.events({
  'submit form': function(event) {
    event.preventDefault();
    var ing_items = $(event.target).find("[name=selectedIng]").get();
    var ing_items_doc = [];
    ing_items.forEach(function(ing) {
      var dataid = $(ing).attr("data-id");
      var check = $(ing).is(':checked');
      if(dataid && check) {
        ing_items_doc.push(dataid);
      }
    });
    if(ing_items_doc.length > 0) {
      Session.set("selectedIngredients", ing_items_doc);
    } else {
      Session.set("selectedIngredients", null);
    }
    $("#ingredientsListModal").modal("hide");
  },

  'keyup #searchText-box': function(event) {
    var searchText = $("#searchText-box").val();
    Session.set("searchText", searchText);
  }
});

Template.showIngredientsList.rendered = function() {
  Session.set("searchText", "");
}

Tracker.autorun(function() {
  var searchText = Session.get('searchText');
  return Meteor.subscribe("ingredientsSearch", searchText, ing_ids);
});