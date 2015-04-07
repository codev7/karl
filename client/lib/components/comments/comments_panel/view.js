Template.commentsPanel.helpers({
  'commentsList': function() {
    var item = Session.get("thisMenuItem");
    var comments = Comments.find({"reference": item}).fetch();
    return comments;
  }
});