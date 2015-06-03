var component = FlowComponents.define('profile', function(props) {
});

component.state.basic = function() {
  var id = Router.current().params._id;
  var user = Meteor.users.findOne(id);
  if(user) {
    this.set("user", user);
    return user;
  }
}

component.state.email = function() {
  var user = this.get("user");
  if(user) {
    return user.emails[0].address;
  }
}

component.state.image = function() {
  var user = this.get("user");
  if(user) {
    if(user.services && user.services.google) {
      return user.services.google.picture;
    } else {
      return "/images/user-image.jpeg";
    }
  }
}

component.state.isPermitted = function() {
  var user = this.get("user");
  if(isAdmin() || isManager()) {
    if(user._id == Meteor.userId()) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

