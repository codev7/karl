var component = FlowComponents.define("navigation", function(props) {});

component.state.id = function() {
  return Meteor.userId();
}

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
  return Meteor.user().isAdmin;
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

component.state.isManagerOrAdmin = function() {
  if(isAdmin()) {
    return true;
  } else if(isManager()) {
    return true;
  } else if(isWorker()) {
    return false;
  }
}

component.state.category = function() {
  if(Session.get("category")) {
    return Session.get('category');
  } else {
    return "all";
  }
}


component.state.status = function() {
  if(Session.get("status")) {
    return Session.get('status');
  } else {
    return "all";
  }
}