var component = FlowComponents.define('submitJobItem', function(props) {
});

component.state.initialHTML = function() {
  return "Add recipe here";
};

component.action.submit = function(info) {
  Meteor.call("createJobItem", info, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Session.set("selectedIngredients", null);
      Session.set("selectedJobItems", null);
      Router.go("jobItemDetailed", {"_id": id});
    }
  });
};