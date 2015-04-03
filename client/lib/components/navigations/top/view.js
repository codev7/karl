Template.navTop.helpers({
  'isAdmin': function() {
    return isAdmin();
  },

  'isPermitted': function() {
    return isManagerOrAdmin(Meteor.userId());
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