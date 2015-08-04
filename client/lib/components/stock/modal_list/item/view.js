Template.ingredientModalItem.helpers({
  costPerPortionUsed: function() {
    var costPerPortionUsed = 0;
    if((this.costPerPortion > 0) && (this.unitSize > 0)) {
      costPerPortionUsed = this.costPerPortion/this.unitSize;
      costPerPortionUsed = Math.round(costPerPortionUsed * 100)/100;
      if(costPerPortionUsed === 0) {
        costPerPortionUsed = 0.001;
      }
    }
    return costPerPortionUsed;
  }
});

Template.ingredientModalItem.rendered = function() {
  $('.i-checks').iCheck({
    checkboxClass: 'icheckbox_square-green'
  });
}