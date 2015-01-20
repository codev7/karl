Template.jobsList.helpers({
  "jobs": function() {
    var jobs = Jobs.find({"onshift": null, "status": "draft"}).fetch();
    return jobs;
  }
});

Template.jobsList.rendered = function() {
  this.autorun(function() {
    $("#jobsList").sortable({
      // helper: "clone",
      connectWith: ".shiftedJobs"
    })
    .droppable({
      drop: function(event, ui) {
        if(ui.draggable[0].dataset.title == "job") {
          var jobId = ui.draggable[0].dataset.id;
          var shiftId = $(this).attr("data-id");
          Meteor.call("assignJobToShift", jobId, shiftId, function(err) {
            if(err) {
              return alert(err.reason);
            }
          });
        }
      }
    });
  });  
}
