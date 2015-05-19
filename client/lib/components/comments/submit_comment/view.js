Template.submitComment.events({
  'keypress .message-input': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var text = $(".message-input").val();
      FlowComponents.callAction('submit', text);
    }
  }
});