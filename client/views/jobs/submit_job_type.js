Template.submitJobType.events({
  'click #submitJobType': function(event) {
    event.preventDefault();
    var jobType = $("#jobType").val();
    if(!jobType || !jobType.trim()) {
      return alert("Add job type");
    } 
    Meteor.call("addJobType", jobType, function(err) {
      if(err) {
        return alert(err.reason);
      } else {
        $("#addJobTypeModal").modal("hide");
      }
    });
  }
});