Template.shiftItem.helpers({
  "shifts": function() {
    var shifts = Shifts.find({"shiftDate": new Date().toISOString().slice(0,10).replace(/-/g,"-")}).fetch();
    return shifts;
  },

  "jobs": function() {
    var jobs = Jobs.find({"onshift": this._id}).fetch();
    return jobs;
  },

  "workers": function() {
    var shifts = Shifts.findOne(this._id);
    if(shifts) {
      var workers = [];
      if(shifts.assignedTo) {
        shifts.assignedTo.forEach(function(workerId) {
          var worker = Workers.findOne(workerId);
          if(worker) {
            workers.push(worker);
          }
        });
      }
      return workers;
    }
    
  }
});

Template.shiftItem.rendered = function() {
  this.autorun(function() {
    var shifts = Shifts.find({"createdOn": new Date().toISOString().slice(0,10).replace(/-/g,"")}).fetch();
    if(shifts) {
      Tracker.afterFlush(function() {
        $(".shiftedJobs").sortable({
          connectWith: ".jobsList, .shiftedJobs"
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
        $(".shiftedWorkers").sortable({
          connectWith: ".shiftedWorkers"
        })
        .droppable({
          activate: function(event, ui) {
            var workerId = ui.helper[0].dataset.id;
            var shiftId = $($(event)[0].currentTarget).attr("data-id");
            Meteor.call("deleteWorkerAssignedShift", workerId, shiftId, function(err) {
              if(err) {
                return alert(err.reason);
              }
            });
          },
          drop: function(event, ui) {
            if(ui.draggable[0].dataset.title == "worker") {
              var workerId = ui.draggable[0].dataset.id;
              var shiftId = $(this).attr("data-id");
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
