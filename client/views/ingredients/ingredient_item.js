Template.ingredientItem.events({
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

Template.ingredientItem.helpers({
  costPerPortion: function() {
    console.log(this);
    var unitId = this.unit + "-" + this.portionUsed;
    console.log(unitId);
    var conversion = Conversions.findOne(unitId);
    console.log(conversion);
    var costPerPortion = 0;
    if(conversion) {
      costPerPortion = parseFloat(this.costPerUnit)/parseInt(conversion.count);
    } else {
      costPerPortion = "Convertion not defined"
    }
    return costPerPortion;
  }
});