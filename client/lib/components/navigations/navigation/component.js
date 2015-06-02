var component = FlowComponents.define("navigation", function(props) {});

component.state.profileImage = function() {
  var user = Meteor.user();
  var image = '/images/user-image.jpeg';
  if(user && user.services) {
    if(user.services.google) {
      image = user.services.google.picture;
    }
  } 
  return image;
}

component.state.isAdmin = function() {
  return isAdmin();
}

component.state.userType = function() {
  if(isAdmin()) {
    return "Admin";
  } else if(isManager()) {
    return "Manager";
  } else if(isWorker()) {
    return "Worker";
  }
}

component.state.isPermitted = function() {
  if(isAdmin()) {
    return true;
  } else if(isManager()) {
    return true;
  } else if(isWorker()) {
    return false;
  }
}