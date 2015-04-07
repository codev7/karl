var component = FlowComponents.define("chatUser", function(props) {
  this.user = props.user;
  this.userDetails();
});

component.prototype.userDetails = function() {
  var user = Meteor.users.findOne(this.user._id);
  this.set("username", user.username);
  var image = "/images/user-image.jpeg";
  if(user.services && user.services.google) {
    image = user.services.google.picture;
  }
  this.set("profileImage", image);
}

component.state.name = function() {
  return this.get("username");
}

component.state.profilePicture = function() {
  return this.get("profileImage");
}