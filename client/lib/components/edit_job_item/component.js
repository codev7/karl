var component = FlowComponents.define('editJobItem', function(props) {
  // this.onRendered(this.renderTextEditor);
});

component.state.initialHTML = function() {
  var id = Session.get("thisJobItem");
  var item = JobItems.findOne(id);
  if(item) {
    if(item.recipe) {
      return item.recipe;
    }
  }
};

component.action.submit = function(id, info) {
  Meteor.call("editJobItem", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Router.go("jobItemsMaster");
    }
  });
};