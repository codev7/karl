var component = FlowComponents.define('editIngredientItem', function(props) {
});

component.action.submit = function(id, info, event) {
   Meteor.call("editIngredient", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      IngredientsListSearch.cleanHistory();
      IngredientsListSearch.search("", {"limit": 10});
    }
    $("#editIngredientModal").modal("hide");
  });
};