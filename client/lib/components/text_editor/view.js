Template.textEditor.events({
  'focus .editor': function(event) {
    event.preventDefault();
    var text = $(event.target).text();
    if(text == "Add recipe here") {
      $(event.target).empty();
    }
  }
});