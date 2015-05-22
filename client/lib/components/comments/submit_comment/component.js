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

  var taggedUsers = [];
  matches.forEach(function(username) {
    var filter = new RegExp(username, 'i');
    var subscriber = Meteor.users.findOne({"username": filter});
    if(subscriber) {
      var userClass = "label-info";
      var doc = {
        "user": "@" + subscriber.username,
        "class": userClass
      }
      taggedUsers.push(doc);  
    }
  });

  var classes = ['info', 'success', 'danger', 'primary', 'warning'];
  var textHtml = "<div>" + text + "</div>"
  taggedUsers.forEach(function(user) {
    textHtml = textHtml.replace(user.user, "<span class='label " + user.class + "'>" + user.user + "</span>");
  });
  
  Meteor.call("createComment", textHtml, ref, function(err, id) {
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