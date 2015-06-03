var component = FlowComponents.define("comment", function(props) {
  this.comment = props.comment;
  this.userDetails();
});

component.prototype.userDetails = function() {
  var user = Meteor.users.findOne(this.comment.createdBy);
  if(user) {
    this.set("username", user.username);
    var image = "/images/user-image.jpeg";
    if(user.services && user.services.google) {
      image = user.services.google.picture;
    }
    this.set("profileImage", image);
  }
}

component.state.name = function() {
  if(this.get("username")) {
    return this.get("username");
  }
}

component.state.profilePicture = function() {
  if(this.get("profileImage")) {
    return this.get("profileImage");
  }
}

component.state.text = function() {
  var text = this.comment.text;
  return text;
}

component.state.createdOn = function() {
  return this.comment.createdOn;
}