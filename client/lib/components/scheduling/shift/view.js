Template.schedulingShift.rendered = function() {
  this.autorun(function() {
    var shifts = Shifts.find({"shiftDate": Session.get("thisDate")});
    if(shifts) {
      Tracker.afterFlush(function() {
        $(".shiftedJobs").sortable({
          connectWith: "#jobsList, .shiftedJobs",
          receive: function(event, ui) {
            if(ui.item[0].dataset.title == 'job') {
              var jobId = ui.item[0].dataset.id;
              var shiftId = $(this).attr("data-id");
              Meteor.call("assignJob", jobId, shiftId, function(err) {
                if(err) {
                  console.log("this", event, ui);
                  return alert(err.reason);
                }
              });
            }
          }
        });
      });
    }
  });
}