if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);
  Meteor.subscribe('currentUser');

  IntercomSettings.userInfo = function(user, info) {
    if(user.intercomHash) {
      // add properties to the info object, for instance:
      if(user.services && user.services.google) {
        info.email = user.services.google.email;
        info['Name'] = user.services.google.given_name + ' ' + user.services.google.family_name;
      } else {
        info.email = user.emails[0].address;
      }
    } else {
      return false;
    }
  }
}