var component = FlowComponents.define('commentsPanel', function(props) {
});

component.state.commentsExist = function() {
  var item = Session.get("thisMenuItem");
  var count = Comments.find({"reference": item}).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}