var subs = new SubsManager();
var component = FlowComponents.define('navTop', function(props) {
  var cursors = [];
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()});
  this.notifications = notifications;
  cursors.push(subs.subscribe("unReadNotifications"));
  cursors.push(subs.subscribe("usersList"));
});

component.state.isExistNotifications = function() {
  if(this.notifications && this.notifications.fetch().length > 0) {
    return true;
  }
}


component.state.notificationsCount = function() {
  if(this.notifications) {
    return this.notifications.fetch().length;
  }
}

component.state.notifications = function() {
  if(this.notifications) {
    return this.notifications;
  }
}