Template.ingredientItemDetailed.events({
  'click .editIngredient': function(event) {
    event.preventDefault();
    Session.set("thisIngredient", this);
    $("#editIngredientModal").modal("show");
  },

  'click .deleteIngredient': function(event) {
    event.preventDefault();
    Meteor.call("deleteIngredient", this._id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});

Template.ingredientItemDetailed.helpers({
  costPerPortion: function() {
    var item = getIngredientItem(this._id);
    return item.costPerPortion;
  }
});