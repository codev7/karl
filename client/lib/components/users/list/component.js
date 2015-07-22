var component = FlowComponents.define('usersList', function(props) {
});

component.state.activeUsers = function() {
  return Meteor.users.find({"isActive": true}, {sort: {"username": 1}});
}

component.state.deactiveUsers = function() {
  return Meteor.users.find({"isActive": false}, {sort: {"username": 1}});
}

component.state.permittedAdmin = function() {
  var user = Meteor.user();
  if(user.isAdmin) {
    return true;
  } else {
    return false;
  }
}

component.state.permittedManagerAndAdmin = function() {
  var user = Meteor.user();
  if(user.isAdmin || user.isManager) {
    return true;
  } else {
    return false;
  }
}

