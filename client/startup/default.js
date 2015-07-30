var sub = new SubsManager();
// Run this when the meteor app is started
Meteor.startup(function () {
  sub.subscribe("profileUser", Meteor.userId());
  Session.set("notifiState", false);
  Session.set("shiftState", "future");  
});

