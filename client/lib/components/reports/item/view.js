function shiftWorkTimeUpdate(id, newValue, time) {
  console.log(".............", id, newValue, time);
  var shift = Shifts.findOne(id);
  if(shift && newValue) {
    if(!moment(time).isValid()) {
      time = shift.shiftDate;
    }
    var newHours = moment(newValue).format("HH");
    var newMins = moment(newValue).format("mm");
    var newTime = moment(time).set("hour", newHours).set("minute", newMins);
    return newTime;
    
  }
}

Template.teamHoursItem.events({
  "mouseenter .activeTime": function(event) {
    event.preventDefault();
    $('.editShiftStart').editable({
      type: 'combodate',
      title: 'Select time',
      template: "HH:mm",
      viewformat: "HH:mm",
      format: "YYYY-MM-DD HH:mm",
      display: false,
      showbuttons: true,
      mode: 'inline',
      success: function(response, newValue) {
        var self = this;
        var id = $(self).data("shift");
        var time = $(self).data("time");
        var newTime = shiftWorkTimeUpdate(id, newValue, time);
        newTime = moment(newTime).format("YYYY-MM-DD HH:mm");
        Meteor.call("editClock", id, {"startedAt": new Date(newTime).getTime()}, function(err) { 
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            $(self).removeClass('editable-unsaved');
            return;
          }
        });
      }
    });

    $('.editShiftEnd').editable({
      type: 'combodate',
      title: 'Select time',
      template: "HH:mm",
      viewformat: "HH:mm",
      format: "YYYY-MM-DD HH:mm",
      url: '/post',
      display: false,
      showbuttons: true,
      mode: 'inline',
      success: function(response, newValue) {
        var self = this;
        var id = $(self).data("shift");
        var time = $(self).data("time");
        var newTime = shiftWorkTimeUpdate(id, newValue, time);
        newTime = moment(newTime).format("YYYY-MM-DD HH:mm");
        Meteor.call("editClock", id, {"finishedAt": new Date(newTime).getTime()}, function(err) { 
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            $(self).removeClass('editable-unsaved');
            return;
          }
        });
      }
    });
  }, 

  'click .stopCurrentShift': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-shift");
    var confirmClockout = confirm("Are you sure you want to clockout this shift ?");
    if(confirmClockout && id) {
      Meteor.call("clockOut", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});