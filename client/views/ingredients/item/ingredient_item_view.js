Template.ingredientItemView.helpers({
  item: function() {
    var self = this;
    var ing = Ingredients.findOne(self.id);
    if(ing) {
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
  }
});