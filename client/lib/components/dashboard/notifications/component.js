var subs = new SubsManager();

var component = FlowComponents.define("notificationsList", function(props) {
  this.onRendered(this.onListRendered);
  subs.subscribe("readNotifications");
});

component.state.notifications = function() {
  var state = Session.get("notifiState");
  var notifications = Notifications.find({"read": state, "to": Meteor.userId()}, {sort: {"createdOn": -1}, limit: 10});
  console.log(notifications.fetch());
  return notifications;
}

component.prototype.onListRendered = function() {
  var state = Session.get("notifiState");
  if(state) {
    $(".readNoti").addClass("label-primary");
  } else {
    $(".newNoti").addClass("label-primary");
  }
}