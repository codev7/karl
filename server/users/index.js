Accounts.onCreateUser(function(options, user){
  console.log("..user", user);
  console.log("options...", options)
  user.profile = options.profile || {};
  if(options.profile) {
    if(!options.profile.email) {
      user.emails = [{ "address": null}];
      user.emails[0].address = user.services.google.email;
      user.username = options.profile.name;
    }
  }     
  if(!user.profile.name) {
    user.profile.name = user.username;
  }
  
  // if this is the first user ever, make them an admin
  if(!Meteor.users.find().count()) {
    user.isAdmin = true;
  } else {
    user.isWorker = true;
  }
  return user;
});