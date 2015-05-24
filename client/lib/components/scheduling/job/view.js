Template.schedulingJob.events({
  'click .set-job-status': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("setJobStatus", id, function(err) {
      if(err) {
        return alert(err.reason);
      }
    }); 
  }
});