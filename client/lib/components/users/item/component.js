var component = FlowComponents.define('userDetailed', function(props) {
  this.user = props.user;
});

component.state.user = function() {
  return this.user;
}

component.state.email = function() {
  return this.user.emails[0].address;
}

component.state.type = function() {
  var type = null;
  if(this.user.isAdmin) {
    type = "Admin";
  } else if(this.user.isManager) {
    type = "Manager";
  } else {
    type = "Worker";
  }
  return type;
}

component.state.isAdminOrManager = function() {
  if(this.user.isAdmin || this.user.isManager) {
    return true;
  } else {
    return false;
  }
}

component.state.isManager = function() {
  if(this.user.isManager) {
    return true;
  } else {
    return false;
  }
}

component.state.isWorker = function() {
  if(this.user.isWorker) {
    return true;
  } else {
    return false;
  }
}

component.state.ifMe = function() {
  var me = Meteor.user();
  if(me && me._id == this.user._id) {
    return false;
  } else {
    return true;
  }
}

component.state.permittedManagerAndAdmin = function() {
  var user = Meteor.user();
  if(user.isAdmin || user.isManager) {
    return true;
  } else {
    return false;
  }
}

component.state.permittedAdmin = function() {
  var user = Meteor.user();
  if(user.isAdmin) {
    return true;
  } else {
    return false;
  }
}