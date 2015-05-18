var component = FlowComponents.define('menuItemDetail', function(props) {
});

component.state.menuSubs = function() {
  var userId = Meteor.userId();
  var menuListSubs = Subscriptions.findOne({"_id": "menulist", "subscribers": userId});
  if(menuListSubs) {
    return true;
  } else {
    var menuSubs = Subscriptions.findOne({"_id": Session.get("thisMenuItem"), "subscribers": userId});
    if(menuSubs) {
      return true;
    } else {
      return false;
    }
  }
}
