var component = FlowComponents.define('usersList', function(props) {
});

component.state.activeUsers = function() {
  return Meteor.users.find({"isActive": true}, {sort: {"username": 1}});
}

component.state.deactiveUsers = function() {
  return Meteor.users.find({"isActive": false}, {sort: {"username": 1}});
}
