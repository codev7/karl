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
      self.cost = parseFloat(costPerPortion * parseInt(self.quantity));
      self.cost = Math.round(self.cost * 100)/100;
    }
    return self;
  },

  costOfPortion: function() {
    var costPerPortion = 0;
    var ing = Ingredients.findOne(this.id);
    if(ing) {
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
    }
    return costPerPortion;
  }
});