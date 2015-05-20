var component = FlowComponents.define('submitMenuItem', function(props) {
});

component.state.initialHTML = function() {
  return "Add instructions here";
};

component.action.submit = function(info) {
  Meteor.call("createMenuItem", info, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
    Session.set("selectedIngredients", null);
    Session.set("selectedJobItems", null);
    Meteor.call("sendNotifications", 'menuCreate', id, null, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
    Router.go("menuItemDetail", {"_id": id});
  });
};
