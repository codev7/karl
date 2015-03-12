Template.ingredientItemListed.helpers({
  costPerPortionUsed: function() {
    if(this) {
      var item = getIngredientItem(this._id);
      if(item) {
        return item.costPerPortionUsed;
      }
    }
  }
});