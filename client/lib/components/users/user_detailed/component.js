var component = FlowComponents.define('userDetailed', function(props) {
  this.user = props.user;
});

component.state.id = function() {
  return this.user._id;
}

component.state.username = function() {
  return this.user.username;
}

component.state.email = function() {
  return this.user.emails[0].address;
}

component.state.type = function() {
  var type = getUserType(this.user._id);
  this.set("type", type);
  return type;
}

component.state.isAdmin = function() {
  if(this.get("type")) {
    var type = this.get("type");
    if(type == "Admin") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isManager = function() {
  if(this.get("type")) {
    var type = this.get("type");
    if(type == "Manager") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isWorker = function() {
  if(this.get("type")) {
    var type = this.get("type");
    if(type == "Worker") {
      return true;
    } else {
      return false;
    }
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

component.state.isPermitted = function() {
  if(isAdmin() || isManager()) {
    return true;
  } else {
    return false;
  }
}