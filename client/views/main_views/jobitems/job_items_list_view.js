Template.jobItemsListView.events({
  'click #submitJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  },

  'click .subscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("subscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .unSubscribeJobsList': function(event) {
    event.preventDefault();
    Meteor.call("unSubscribe", "joblist", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});

Template.jobItemsListView.helpers({
  'isSubscribed': function() {
    var result = Subscriptions.findOne({"_id": "joblist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
});