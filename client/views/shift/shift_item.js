Template.shiftItem.rendered = function() {
  Deps.autorun(function() {
    setTimeout(function() {
      $(".shiftedJobs").sortable({
        // helper: "clone",
        connectWith: ".jobsList, .shiftedJobs"
      })
      .droppable({
        drop: function(event, ui) {
          if(ui.draggable[0].dataset.title == "job") {
            var jobId = ui.draggable[0].dataset.id;
            var shiftId = $(this).attr("data-id");
            Meteor.call("moveJob", jobId, shiftId, function(err) {
              if(err) {
                return alert(err.reason);
              }
            });
          }
        }
      });

      $(".shiftedWorkers").sortable({
        // helper: "clone",
        connectWith: ".workersList, .shiftedWorkers"
      });
      
    }, 20);
  });
}

Template.shiftItem.helpers({
  "shifts": function() {
    var shifts = Shifts.find().fetch();
    return shifts;
  },

  "jobs": function() {
    var jobs = Jobs.find({"onshift": this._id}).fetch();
    return jobs;
  }
});