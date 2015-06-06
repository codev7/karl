Template.signIn.events({
  'click #at-signUp': function(event) {
    event.preventDefault();
    Router.go("signUp");
  }
});