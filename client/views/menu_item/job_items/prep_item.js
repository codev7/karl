Template.prepItem.helpers({
  costPerPortion: function() {
    var jobItem = this;
    jobItem.totalCost = 0;
    jobItem.costPerPortion = 0;
    jobItem.ingredients.forEach(function(doc) {
      var ing = Ingredients.findOne(doc.id);
      var cost = 0;
      if(ing) {
        if(ing.unit == "each") {
          cost = parseFloat(ing.costPerUnit)/parseInt(ing.unitSize)
        }  else {
          var unitId = ing.unit + "-" + ing.portionUsed;
          var conversion = Conversions.findOne(unitId);
          if(conversion) {
            var convertedCount = parseInt(conversion.count);
            if(ing.unitSize > 1) {
              convertedCount = (convertedCount * parseInt(ing.unitSize));
            }
            cost = parseFloat(ing.costPerUnit)/convertedCount;
          } else {
            cost = 0;
            console.log("Convertion not defined");
          }
          var calc_cost = cost * doc.quantity
          jobItem.totalCost += calc_cost;
        }
      }
      jobItem.costPerPortion = (jobItem.totalCost/jobItem.portions);
    });
  return parseFloat(jobItem.costPerPortion).toFixed(2);
  }
});