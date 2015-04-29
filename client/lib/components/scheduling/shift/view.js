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

Template.schedulingShift.events({
  'change .shiftAssign': function(event) {
    var workerId = $(event.target).val();
    if(workerId == "null") {
      workerId = null;
    }
    var shiftId = $(event.target).attr("data-id")
    Meteor.call("assignWorker", workerId, shiftId, function(err) {
      if(err) {
        return alert(err.reason);
      }
    });
  },

  'click .shift-profile': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("thisShift", id);
    $("#shiftProfile").modal();
  }
});