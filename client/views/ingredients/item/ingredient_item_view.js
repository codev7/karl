Template.ingredientItemView.helpers({
  item: function() {
    var self = this;
    var item = getIngredientItem(this.id);
    item.cost = item.costPerPortion * this.quantity;
    return item;
  }
});