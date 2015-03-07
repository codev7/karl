Template.ingredientItemView.helpers({
  item: function() {
    var self = this;
    var item = getIngredientItem(this.id);
    if(item) {
      item.cost = item.costPerPortion * this.quantity;
      return item;
    }
  }
});