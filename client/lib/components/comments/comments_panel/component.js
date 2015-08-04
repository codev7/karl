var component = FlowComponents.define('commentsPanel', function(props) {
  this.referenceId = props.id;
  this.refType = props.type;
});

component.state.commentsExist = function() {
  var item = this.referenceId;
  var count = Comments.find({"reference": item}, {sort: {"createdOn": 1}}).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}

component.state.id = function() {
  return this.referenceId;
}

component.state.type = function() {
  return this.refType;
}

component.state.commentsList = function() {
  var item = this.referenceId;
  var comments = Comments.find({"reference": item}).fetch();
  return comments;
}