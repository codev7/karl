Template.navTop.helpers({
  'isAdmin': function() {
    return isAdmin();
  },

  'isPermitted': function() {
    return isManagerOrAdmin(Meteor.userId());
  },

  'profileImage': function() {
    var user = Meteor.user();
    var image = '/images/user-image.jpeg';
    if(user && user.services) {
      if(user.services.google) {
        image = user.services.google.picture;
      }
    } 
    return image;
  },

  today: function() {
    var date = moment(new Date()).format("YYYY-MM-DD");
    return date;
  }
});

Template.navTop.events({
  'click #signInButton': function(event) {
    event.preventDefault();
    Router.go("signIn");
  },

  'click #signOutButton': function(event) {
    event.preventDefault();
    Meteor.logout();
  }
});