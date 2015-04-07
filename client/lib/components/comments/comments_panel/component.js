var component = FlowComponents.define('commentsPanel', function(props) {
  this.referenceId = Router.current().params._id;
});

component.state.commentsExist = function() {
  var item = this.referenceId;
  var count = Comments.find({"reference": item}).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}

component.state.commentsList = function() {
  var item = this.referenceId;
  var comments = Comments.find({"reference": item}).fetch();
  return comments;
}