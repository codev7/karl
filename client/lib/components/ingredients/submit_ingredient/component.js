var component = FlowComponents.define('submitIngredient', function(props) {
});

component.action.submit = function(info) {
  Meteor.call("createIngredients", info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
    $("#addIngredientModal").modal("hide");
  });
};