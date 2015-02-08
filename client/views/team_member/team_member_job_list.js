Template.teamMemberJobList.helpers({
  shift: function() {
    var shift = Shifts.findOne({"assignedTo": Session.get("thisWorker")})
    return shift;
  },

  jobs: function() {
    var shift = Shifts.findOne({"assignedTo": Session.get("thisWorker")})
    var jobList = [];
    if(shift) {
      if(shift.jobs.length > 0) {
        shift.jobs.forEach(function(job) {
          jobList.push(Jobs.findOne(job));
        });
      }
    }
    return jobList;
  },

  "timer120": function() {
    var timer = [];
    var shift = Shifts.findOne({"assignedTo": Session.get("thisWorker")});
    if(shift) {
      var startTime = moment(shift.startTime).format("HH:mm A");
      var endTime = moment(shift.endTime).format("HH:mm A");
      for (var i = parseInt(startTime); i <= parseInt(endTime); i++) {
        var time = i;
        if(i < 12) {
          time += " AM";
        } else {
          time += " PM"
        }
        timer.push(time);
      };
    }
    return timer;
  }
});