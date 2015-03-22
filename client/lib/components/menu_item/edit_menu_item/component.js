var component = FlowComponents.define('editMenuItem', function(props) {
  // this.onRendered(this.renderTextEditor);
});

component.state.initialHTML = function() {
  var id = Session.get("thisMenuItem");
  var item = MenuItems.findOne(id);
  if(item) {
    if(item.instructions) {
      return item.instructions;
    }
  }
};

component.action.submit = function(id, info) {
  Meteor.call("editMenuItem", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Router.go("menuItemDetail", {"_id": id});
    }
  });
};