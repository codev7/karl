Template.topNavbar.rendered = function(){
  // FIXED TOP NAVBAR OPTION
  // Uncomment this if you want to have fixed top navbar
  // $('body').addClass('fixed-nav');
  // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');
};

Template.topNavbar.events({
  // Toggle left navigation
  'click #navbar-minimalize': function(event){
    event.preventDefault();
    // Toggle special class
    $("body").toggleClass("mini-navbar");

    // Enable smoothly hide/show menu
    if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
      // Hide menu in order to smoothly turn on when maximize menu
      $('#side-menu').hide();
      // For smoothly turn on menu
      setTimeout(function () {
        $('#side-menu').fadeIn(500);
      }, 100);
    } else if ($('body').hasClass('fixed-sidebar')) {
      $('#side-menu').hide();
      setTimeout(function () {
        $('#side-menu').fadeIn(500);
      }, 300);
    } else {
      // Remove all inline style from jquery fadeIn function to reset menu state
      $('#side-menu').removeAttr('style');
    }
  },

  // Toggle right sidebar
  'click .right-sidebar-toggle': function(){
    $('#right-sidebar').toggleClass('sidebar-open');
  },

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

Template.topNavbar.helpers({
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
})
