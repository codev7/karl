Template.jobItemDetailed.events({
  'click .deleteJobItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var result = confirm("Are you sure, you want to delete this item ?");
    if (result == true) {
      Meteor.call("deleteJobItem", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },

  'click .viewDetail': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Router.go("jobItemDetailed", {_id: id});
  }
});