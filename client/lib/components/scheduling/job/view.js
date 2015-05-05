Template.schedulingJob.events({
  'click .set-job-status': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("setJobStatus", id, function(err) {
      if(err) {
        return alert(err.reason);
      }
    }); 
  },

  'click .showJobProfile': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisJob", id);
    $("#jobProfile").modal();
  }
});