var component = FlowComponents.define('menuFilters', function(props) {
});

component.state.categories = function() {
  return Categories.find().fetch();
}

component.state.statuses = function() {
  return Statuses.find().fetch();
}

component.state.isAdmin = function() {
  return isAdmin();
}