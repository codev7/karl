var component = FlowComponents.define("submitComment", function(props) {
  this.referenceId = Router.current().params._id;
});

component.action.submit = function(text) {
  var ref = this.referenceId;
  Meteor.call("createComment", text, ref, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
    $('.message-input').val("");
  });
}