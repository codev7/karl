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

component.state.fromNow = function() {
  if(this.notification) {
    return moment(this.notification.editedOn).fromNow();
  }
}

component.state.by = function() {
  if(this.notification) {
    var by = Meteor.users.findOne(this.notification.editedBy);
    if(by) {
      return by.username;
    }
  }
}