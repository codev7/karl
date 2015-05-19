Template.menuItemsListView.events({
  'click #submitMenuItem': function(event) {
    event.preventDefault();
    Router.go("submitMenuItem");
  },

  'click .subscribeMenuList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "menulist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeMenuList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "menulist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});

Template.menuItemsListView.helpers({
  'isSubscribed': function() {
    var result = Subscriptions.findOne({"_id": "menulist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
});