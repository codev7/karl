Template.jobListed.events({
  'click .deleteJob': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var confirmDelete = confirm("Are you sure you want to delete this job ?");
    if(confirmDelete) {
      Meteor.call("deleteJob", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});