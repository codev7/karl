Template.shiftsDailyItem.helpers({
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
    var startTime = moment(this.startTime).format("HH:mm A");
    var endTime = moment(this.endTime).format("HH:mm A");
    for (var i = parseInt(startTime); i <= parseInt(endTime); i++) {
      var time = i;
      if(i < 12) {
        time += " AM";
      } else {
        time += " PM"
      }
      timer.push(time);
    };
    return timer;
  },

  'timer60': function() {
    var arr = [1];
    return arr;
  },

  "workers": function() {
    var shifts = Shifts.find({'shiftDate': Session.get("thisDate")}).fetch();
    var busyWorkers = [];
    var onShiftWorkers = [];
    var onHolidayWorkers = [];
    if(shifts.length > 0) {
      shifts.forEach(function(shift) {
        if(shift.assignedTo) {
          onShiftWorkers.push(shift.assignedTo);
        }
      });
    }
    var holidays = Holidays.findOne({"date": Session.get("thisDate")});
    if(holidays) {
      if(holidays.workers.length > 0) {
        onHolidayWorkers = holidays.workers;
      }
    }
    busyWorkers = onShiftWorkers.concat(onHolidayWorkers);
    var workers = Workers.find({_id: {$nin: busyWorkers}}).fetch();
    return workers;
  }
});

Template.shiftsDailyItem.events({
  'click .shift-profile': function(event, instance) {
    Session.set("thisShift", this);
    $("#shiftProfile").modal();
  },

  'change .shiftAssign': function(event) {
    event.preventDefault();
    var self = this;
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate());
    yesterday = moment(yesterday).format("YYYY-MM-DD");
    var workerId = $(event.target).val();
    var shiftId = $(event.target).attr("data-id")
    Meteor.call("assignWorker", workerId, shiftId, function(err) {
      if(err) {
        $('[name=workers]').val(self.assignedTo);
        return alert(err.reason);

      }
    });      
  }
});

Template.shiftsDailyItem.rendered = function() {
  this.autorun(function() {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate());
    yesterday = moment(yesterday).format("YYYY-MM-DD");
    if(Session.get("thisDate") >= yesterday) {
      var shifts = Shifts.find({"shiftDate": Session.get("thisDate")}).fetch();
      if(shifts) {
        Tracker.afterFlush(function() {
          $(".job-panel").sortable({
            items: ".jobitem",
            disabled: false,
            connectWith: "#jobsList, .shiftedJobs",
            revert: true,
            dropOnEmpty: true,
          })
          .droppable({
            accept: ".jobitem",
            tolerance: "intersect",
            drop: function(event, ui) {
              var title = ui.draggable[0].dataset.title;
              if(title == "draft" || title == "assigned") {
                var thisShift = $(ui.draggable[0]).parent()[0];
                var jobId = ui.draggable[0].dataset.id;
                var self = this;
                var shiftId = $(self).attr("data-id");
                Meteor.call("assignJob", jobId, shiftId, function(err) {
                  if(err) {
                    alert(err.reason);
                    return;
                  }
                });
              } else {
                return event;
              }
            }
          });
        });
      }
    }
  });
}
