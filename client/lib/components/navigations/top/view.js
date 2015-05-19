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
  },

  week: function() {
    var week = moment().format("w");
    return week;
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
  },

  'click .markAllAsRead': function(event) {
    event.preventDefault();
    var notifi = Notifications.find({"read": false, "to": Meteor.userId()}).fetch();
    notifi.forEach(function(not) {
      Meteor.call("readNotifications", not._id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    });
  }
});