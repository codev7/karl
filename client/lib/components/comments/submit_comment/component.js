var component = FlowComponents.define("submitComment", function(props) {
  this.referenceId = Router.current().params._id;
});

component.action.submit = function(text) {
  var ref = this.referenceId;
  //find tagged users
  var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
  while (match = matched.exec(text)) {
    matches.push(match[1]);
  }

  Meteor.call("createComment", text, ref, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Meteor.call("notifyTagged", matches, ref, id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
    $('.message-input').val("");
  });
}