Template.jobsList.rendered = function() {
  Deps.autorun(function() {
    $(".jobsList").sortable({
      // helper: "clone",
      connectWith: ".jobs"
    })
    .droppable({
      drop: function(event, ui) {
        if(ui.draggable[0].dataset.title == "job") {
          var jobId = ui.draggable[0].dataset.id;
          var shiftId = $(this).attr("data-id");
          console.log("-----jobsList----", jobId, shiftId);
          Meteor.call("moveJob", jobId, shiftId, function(err) {
            if(err) {
              return alert(err.reason);
            }
          });
        }
      }
    });
  });  
}

Template.jobsList.helpers({
  "jobs": function() {
    var jobs = Jobs.find().fetch();
    return jobs;
  }
});