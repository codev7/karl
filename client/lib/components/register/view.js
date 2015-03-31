Template.register.events({
  'submit form': function(event) {
    event.preventDefault();
    var username = $(event.target).find('[name=username]').val();
    var email = $(event.target).find('[name=email]').val();
    var password = $(event.target).find('[name=password]').val();
    var checked = $(event.target).find('[name=agreeToTerms]').is(':checked');
    if(checked) {
      var options = {
        'username': username,
        'email': email,
        'password': password
      }
      Accounts.createUser(options, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason); 
        } else {
          Router.go("/");
        }
      })
    } else {
      return alert("Agree to our Terms and Conditions to proceed");
    }
  }
});