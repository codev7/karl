Template.pageHeading.helpers({
  // Route for Home link in breadcrumbs
  home: 'dashboard1'
});

Template.pageHeading.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuItemBtn': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "menulist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeMenuItemBtn': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "menulist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click #menuSubmit': function(event) {
    event.preventDefault();
    $("#submitNewMenu").submit();
  }
});