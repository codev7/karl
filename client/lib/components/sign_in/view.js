Template.signIn.events({
  'submit form': function(event) {
    event.preventDefault();
    var username = $(event.target).find('[name=username]').val();
    var password = $(event.target).find('[name=password]').val();
    Meteor.loginWithPassword(username, password, function(err) {
      if(err) {
        console.log(err)
        return alert(err.reason);
      } else {
        Router.go("/");
      }
    });
  },

  'click #signInWithGoogle': function(event) {
    event.preventDefault();
    console.log(".......");
    var options = {
      requestPermissions: ['email'],
      loginStyle: "popup"
    }
    Meteor.loginWithGoogle(options, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});