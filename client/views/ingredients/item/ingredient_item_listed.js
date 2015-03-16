Template.ingredientItemListed.helpers({
  costPerPortionUsed: function() {
    var costPerPortionUsed = this.costPerPortion/this.unitSize;
    costPerPortionUsed = Math.round(costPerPortionUsed * 100)/100;
    return costPerPortionUsed;
  }
});