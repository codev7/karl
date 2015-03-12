Template.ingredientItemView.helpers({
  item: function() {
    var self = this;
    var item = getIngredientItem(this._id);
    if(item) {
      item.cost = item.costPerPortionUsed * this.quantity;
      item.cost = Math.round(item.cost * 100)/100;
      return item;
    }
  }
});