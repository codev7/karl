Template.teamHoursItem.rendered = function() {
  $('.editShiftStart').editable({
    type: 'combodate',
    title: 'Select time',
    template: "HH:mm",
    viewformat: "hh:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    showbuttons: true,
    success: function(response, newValue) {
      var id = $(this).data("pk");
      var time = $(this).data("time");
      var newTime = shiftWorkTimeUpdate(id, newValue, time);
      newTime = moment(newTime).format("YYYY-MM-DD HH:mm");
      Meteor.call("editClock", id, {"startedAt": new Date(newTime).getTime()}, function(err) { 
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });

  $('.editShiftEnd').editable({
    type: 'combodate',
    title: 'Select time',
    template: "HH:mm",
    viewformat: "hh:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    showbuttons: true,
    success: function(response, newValue) {
      var id = $(this).data("pk");
      var time = $(this).data("time");
      var newTime = shiftWorkTimeUpdate(id, newValue, time);
      newTime = moment(newTime).format("YYYY-MM-DD HH:mm");
      Meteor.call("editClock", id, {"finishedAt": new Date(newTime).getTime()}, function(err) { 
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  });
}

function shiftWorkTimeUpdate(id, newValue, time) {
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