Template.signUp.events({
  'click #at-signIn': function(event) {
    event.preventDefault();
    Router.go("signIn");
  }
});