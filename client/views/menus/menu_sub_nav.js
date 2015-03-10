Template.menuSubNav.events({
  'click #createNewMenu': function(event) {
    event.preventDefault();
    Router.go("menuSubmit");
  }
});