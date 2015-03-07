selectedIngredients = [];
Template.ingredientItemListed.events({
  'click .selectedIng': function(event) {
    var item = $(event.target).attr("data-id");
    var qty = $(event.target).parent().parent().find("input[type=text]").val();
    var index = selectedIngredients.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedIngredients.push(item);
      }
    } else if(index >= 0) {
      if(!isChecked) {
        selectedIngredients.splice(index, 1)
      } 
    }
  }
});

Template.ingredientItemListed.helpers({
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
        costPerPortion = "Convertion not defined"
      }
    }
    return parseFloat(costPerPortion).toFixed(2);
  }
});