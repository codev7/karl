Template.submitComment.events({
  'keypress .message-input': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var text = $(".message-input").val();
      FlowComponents.callAction('submit', text);
    }
  }
});

Template.submitComment.helpers({
  settings: function() {
    return {
      position: "top",
      limit: 5,
      rules: [
        {
          token: '@',
          collection: Meteor.users,
          field: "username",
          template: Template.user
        }
      ]
    };
  }
});

Template.submitComment.rendered = function() {
  $(".message-input").val("");
}