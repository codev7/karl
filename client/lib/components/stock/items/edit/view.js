Template.ingredientItemEdit.helpers({
  item: function() {
    if(this._id) {
      var item = getIngredientItem(this._id);
      if(item) {
        if(this.quantity) {
          item.quantity = this.quantity;
        }
        return item;
      }
    }
  }
});

Template.ingredientItemEdit.events({
  'click .removeIng': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var ingList = Session.get("selectedIngredients");
    if(ingList) {
      if(ingList.length > 0) {
        var index = ingList.indexOf(id);
        if(index >= 0) {
          ingList.splice(index, 1);
          Session.set("selectedIngredients", ingList);
        }
      }
    }
    var item = $(event.target).closest('tr');
    $(item).remove();
  }
});