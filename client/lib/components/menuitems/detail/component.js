var component = FlowComponents.define('menuItemDetail', function(props) {
});

component.state.isSubscribed = function() {
  var userId = Meteor.userId();
  var menuSubs = Subscriptions.findOne({"_id": Session.get("thisMenuItem"), "subscribers": userId});
  if(menuSubs) {
    return true;
  } else {
    return false;
  }
}
