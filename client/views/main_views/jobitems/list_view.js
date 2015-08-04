Template.jobItemsListMainView.events({
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

Template.jobItemsListMainView.helpers({
  'isSubscribed': function() {
    var result = Subscriptions.findOne({"_id": "joblist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  },

  jobTypes: function() {
    return JobTypes.find();
  }
});

Template.jobItemsListMainView.rendered = function() {
  $(".jobtypesPanel").find("li").first().addClass("active");
  if($(".jobtypepanes") && $(".jobtypepanes").length > 0) {
    var elem = $(".jobtypepanes")[0];
    $(elem).addClass("active");

  }
}