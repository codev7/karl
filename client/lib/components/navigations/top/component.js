var subs = new SubsManager();
var component = FlowComponents.define('navTop', function(props) {
  var cursors = [];
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}});
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
  var count = this.notifications.fetch().length;
  return count;
}

component.state.notifications = function() {
  var notifications = Notifications.find({"read": false, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 5});
  return notifications;
}