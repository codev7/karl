Template.jobFlyout.events({
  'click .removeAssignedJob': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("assignJob", id, null, null, function(err) {
      if(err) {
        console.log(err);
      }
      $(".theme-config-box").toggleClass("show");
    });
  }
});