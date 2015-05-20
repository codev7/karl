var component = FlowComponents.define("notificationItem", function(props) {
  this.notification = props.noti;
});

component.state.id = function() {
  if(this.notification) {
    return this.notification._id;
  }
}

component.state.msg = function() {
  if(this.notification) {
    return this.notification.msg;
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

component.state.createdByImg = function() {
  var img = "/images/user-image.jpeg";
  if(this.notification && this.notification.createdBy) {
    var user = Meteor.users.findOne(this.notification.createdBy);
    if(user && user.services) {
      if(user.services.google) {
        img = user.services.google.picture;
      }
    }
    return img;
  } 
}

component.state.fromNow = function() {
  if(this.notification && this.notification.createdOn) {
    return moment(this.notification.createdOn).fromNow();
  }
}

component.state.description = function() {
  if(this.notification && this.notification.desc) {
    return this.notification.desc;
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