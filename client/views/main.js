if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Meteor.subscribe('profileUser', Meteor.userId());

  IntercomSettings.userInfo = function(user, info) {
    if(user.intercomHash) {
      // add properties to the info object, for instance:
      if(user.services && user.services.google) {
        info.email = user.services.google.email;
        info['Name'] = user.services.google.given_name + ' ' + user.services.google.family_name;
      } else {
        info.email = user.emails[0].address;
        info['Name'] = user.username;
      }
      var type = "Worker";
      if(user) {
        if(user.isWorker) {
          type = "Worker";
        } else if(user.isManager) {
          type = "Manager";
        } else if(user.isAdmin) {
          type = "Admin";
        }
      }
      info['Type'] = type;

    } else {
      return false;
    }
  }
}