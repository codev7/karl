Template.ingItem.helpers({
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
    return costPerPortion;
  }
});