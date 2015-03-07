Template.ingredientItemEdit.helpers({
  item: function() {
    var self = this;
    var ing = Ingredients.findOne(self.id);
    if(ing) {
      self._id = self.id;
      self.description = ing.description;
      self.portionUsed = ing.portionUsed;
      if(ing.unit == "each") {
        costPerPortion = parseFloat(ing.costPerUnit)/parseInt(ing.unitSize)
      }  else {
        var unitId = ing.unit + "-" + ing.portionUsed;
        var conversion = Conversions.findOne(unitId);
        if(conversion) {
          var convertedCount = parseInt(conversion.count);
          if(ing.unitSize > 1) {
            convertedCount = (convertedCount * parseInt(ing.unitSize));
          }
          costPerPortion = parseFloat(ing.costPerUnit)/convertedCount;
        } else {
          costPerPortion = 0;
          console.log("Convertion not defined", ing);
        }
      }
      self.costPerPortion = Math.round(costPerPortion * 100)/100;
      self.cost = parseFloat(costPerPortion * parseInt(self.quantity));
      self.cost = Math.round(self.cost * 100)/100;
    }
    return self;
  },

  costOfPortion: function() {
    var costPerPortion = 0;
    if(this) {
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
          console.log("Convertion not defined", this);
        }
      }
    }
    return Math.round(costPerPortion * 100)/100;
  }
});

Template.ingredientItemEdit.events({
  'click .removeIng': function(event) {
    event.preventDefault();
    var routename = Router.current().route.getName();
    var id = $(event.target).attr("data-id");
    if(routename == "menuItemEdit") {
      var menuId = Session.get("thisMenuItem");
      if(id) {
        Meteor.call("removeIngredients", menuId, id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      } else {
        var item = $(event.target).parent().parent();
        $(item).remove();
      }
    } else if(routename == "jobItemEdit") {
      var jobId = Session.get("thisJobItem");
      if(id) {
        Meteor.call("removeIngredientsFromJob", jobId, id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      } else {
        var item = $(event.target).parent().parent();
        $(item).remove();
      }
    }
  }
});