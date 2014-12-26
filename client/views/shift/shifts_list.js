Template.shiftsList.helpers({
  "shifts": function() {
    var shifts = Shifts.find({"shiftDate": Session.get("thisDate")}).fetch();
    shifts.forEach(function(shift) {
      shift.workerDetail = Workers.findOne(shift.assignedTo);
      if(shift.workerDetail) {
        shift.workerDetail.onShift = shift._id;
      }
    });
    return shifts;
  },

  "jobs": function() {
    var jobs = Jobs.find({"onshift": this._id}).fetch();
    return jobs;
  },

  "assignedWorker": function() {
    var shifts = Shifts.findOne(this._id);
    if(shifts) {
      if(shifts.assignedTo) {
        var worker = Workers.findOne(shifts.assignedTo);
        return worker;     
      }
    }  
  },

  "timer120": function() {
    var timer = [];
    var startTime = parseInt(this.startTime)
    var endTime = parseInt(this.endTime) + 1;
    for (var i = startTime; i < endTime; i) {
      var time = moment(i, "HH");
      timer.push(time._i);
      i = i+2;
    };
    return timer;
  },

  'timer60': function() {
    var arr = [1];
    return arr;
  }
});

Template.shiftsList.events({
  'click .shift-profile': function(event, instance) {
    Session.set("thisShift", this);
    $("#shiftProfile").modal();
  }
});

Template.shiftsList.rendered = function() {
  this.autorun(function() {
    var shifts = Shifts.find({"shiftDate": Session.get("thisDate")}).fetch();
    if(shifts) {
      Tracker.afterFlush(function() {
        $(".shiftedJobs").sortable({
          connectWith: "#jobsList, .shiftedJobs"
        })
        .droppable({
          tolerance: "pointer",
          drop: function(event, ui) {
            if(ui.draggable[0].dataset.title == "job") {
              var jobId = ui.draggable[0].dataset.id;
              var shiftId = $(this).attr("data-id");
              Meteor.call("assignJobToShift", jobId, shiftId, function(err) {
                if(err) {
                  console.log("this", event, ui);
                  return alert(err.reason);
                }
              });
            }
          }
        });


        $(".shiftedWorkers")
        .droppable({
          drop: function(event, ui) {
            if(ui.draggable[0].dataset.title == "worker") {
              var workerId = ui.draggable[0].dataset.id;
              var shiftId = $(this).attr("data-id");
              var options = null;
              Meteor.call("assignWorkerToShift", workerId, shiftId, function(err) {
                if(err) {
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
