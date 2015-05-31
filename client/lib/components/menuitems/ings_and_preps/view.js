Template.ingsAndPreps.events({
  'click .remove-ings': function(event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    Meteor.call("removeMenuIngredient", menu, id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .remove-prep': function(event) {
    event.preventDefault();
    var menu = Session.get("thisMenuItem");
    var id = $(event.target).attr("data-id");
    Meteor.call("removeMenuJobItem", menu, id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .view-prep': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Router.go("jobItemDetailed", {"_id": id});
  },

  'click .view-ings': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisIngredientId", id);
    $("#editIngredientModal").modal("show");
  }
});

Template.ingsAndPreps.rendered = function() {
  var menu = Session.get("thisMenuItem");
  $('.username').editable({
    success: function(response, newValue) {
      if(newValue) {
        var ing = $(this).data("pk");
        var type = $(this).data("itemtype");
        if(type == "ings") {
          Meteor.call("addIngredients", menu, [{"_id": ing, "quantity": newValue}], function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
            return;
          });
        } else if(type == "prep") {
          Meteor.call("addJobItem", menu, [{"_id": ing, "quantity": newValue}], function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
            return;
          });
        }
      }
    }
  });
}