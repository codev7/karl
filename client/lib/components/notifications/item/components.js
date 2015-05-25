var component = FlowComponents.define("notificationItem", function(props) {
  this.notification = props.noti;
});

component.state.id = function() {
  if(this.notification) {
    return this.notification._id;
  }
}

component.state.ref = function() {
  if(this.notification) {
    return this.notification.ref;
  }
}

component.state.title = function() {
  if(this.notification) {
    return this.notification.title;
  }
}

component.state.type = function() {
  if(this.notification) {
    return this.notification.type;
  }
}

component.state.permittedActionTypeate = function() {
  if(this.notification) {
    var type = this.notification.actionType;
    if(type && (type == "delete")) {
      return false;
    } else {
      return true;
    }
  }
}

component.state.icon = function() {
  if(this.notification) {
    var type = this.notification.type;
    if(type == "job") {
      return "briefcase";
    } else if(type == "menu") {
      return "cutlery";
    } else if(type == "comment") {
      return "comment";
    }
  }
}

component.state.createdBy = function() {
  if(this.notification && this.notification.createdBy) {
    var user = Meteor.users.findOne(this.notification.createdBy);
    if(user) {
      return user.username;
    }
  }
}

component.state.fromNow = function() {
  if(this.notification && this.notification.createdOn) {
    return moment(this.notification.createdOn).fromNow();
  }
}

component.state.createAt = function() {
  if(this.notification && this.notification.createdOn) {
    return moment(this.notification.createdOn).format("hh:mm A");
  }
}

component.state.text = function() {
  if(this.notification && this.notification.text) {
    console.log(this.notification.text);
    var text = this.notification.text;
    return text;
  }
}

component.state.by = function() {
  var by = null;
  if(this.notification) {
    if(this.notification.editedBy) {
      by = this.notification.editedBy;
    } else if(this.notification.createdBy) {
      by = this.notification.createdBy;
    } else if(this.notification.taggedBy) {
      by = this.notification.taggedBy;
    }

    var user = Meteor.users.findOne(by);
    return user.username;
  }
}