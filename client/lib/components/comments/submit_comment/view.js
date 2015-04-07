Template.submitComment.events({
  'keypress .message-input': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var text = $(".message-input").val();
      var ref = Session.get("thisMenuItem");
      Meteor.call("createComment", text, ref, function(err, id) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
        $('.message-input').val("");
      });
    }
  }
});