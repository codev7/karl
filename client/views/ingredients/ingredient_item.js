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
    var costPerPortion = 0;
    if(this.unit == "each") {
      costPerPortion = parseFloat(this.costPerUnit)/parseInt(this.unitSize)
    }  else {
      var unitId = this.unit + "-" + this.portionUsed;
      var conversion = Conversions.findOne(unitId);
      if(conversion) {
        var convertedCount = parseInt(conversion.count);
        if(this.unitSize > 1) {
          convertedCount = (convertedCount * parseInt(this.unitSize));
        }
        costPerPortion = parseFloat(this.costPerUnit)/convertedCount;
      } else {
        costPerPortion = 0;
        console.log("Convertion not defined");
      }
    }
    return Math.round(parseFloat(costPerPortion) * 100)/100;
  }
});