var autolinker = new Autolinker({
  "twitter": false
});

var component = FlowComponents.define("submitComment", function(props) {
  this.referenceId = props.id;
  this.refType = props.type;
});

component.action.submit = function(text) {
  var ref = this.referenceId;
  var refType = this.refType;
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
  var textHtml = "<div class='non'>" + text + "</div>"
  taggedUsers.forEach(function(user) {
    textHtml = textHtml.replace(user.user, "<span class='label " + user.class + "'>" + user.user + "</span>");
  });

  var linkedText = autolinker.link(textHtml);
  
  Meteor.call("createComment", linkedText, ref, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      var reference = null;
      var ref_name = null;
      var ref_type = refType;
      
      if(refType == "menu") {
        reference = MenuItems.findOne(ref);
      } else if(refType == "job") {
        reference = JobItems.findOne(ref);
      } else if(refType == "workerJob") {
        reference = Jobs.findOne(ref) ;
      }

      if(reference) {
        ref_name = reference.name;
      }
      var options = {
        "title": "New comment on " + ref_name + " by " + Meteor.user().username,
        "users": matches,
        "commentId": id,
        "type": ref_type
      }
      Meteor.call("sendNotifications", ref, "comment", options, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });  
    }
    $('.message-input').val("");
  });
}