Template.shiftProfile.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var shiftId = $(event.target).attr("data-id");
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startTime = $(event.target).find('[name=startTime]').val().trim();
    var endTime = $(event.target).find('[name=endTime]').val().trim();
    var section = $(event.target).find('[name=section]').val();

    var start_hours = parseInt(startTime.slice(0, startTime.indexOf(":")).trim());
    var start_mins = parseInt(startTime.slice(startTime.indexOf(":") + 1, startTime.indexOf(" ")).trim());
    var start_light = startTime.slice(startTime.indexOf(" "), 8).trim();
    if(start_light == "PM") {
      start_hours += 12;
    }

    var dateObj_start = new Date(dateOfShift);
    dateObj_start.setHours(start_hours, start_mins)
      
    var end_hours = parseInt(endTime.slice(0, endTime.indexOf(":")).trim());
    var end_mins = parseInt(endTime.slice(endTime.indexOf(":") + 1, endTime.indexOf(" ")).trim());
    var end_light = endTime.slice(endTime.indexOf(" "), 8).trim();
    if(end_light == "PM") {
      end_hours += 12;
    }

    var dateObj_end = new Date(dateOfShift);
    dateObj_end.setHours(end_hours, end_mins)

    if(!dateObj_start && !dateObj_end) {
      alert("Please add start time and end time for your shift");
      return;
    } else if(dateObj_start.getTime() == dateObj_end.getTime()) {
      alert("Invalid shift start end time combination");
      return;
    } else if(dateObj_start.getTime() > dateObj_end.getTime()) {
      alert("Invalid shift end time");
      return;
    } else {
      var info = {
        "shiftDate": dateOfShift,
        "startTime": dateObj_start,
        "endTime": dateObj_end,
        "section": section
      }
      FlowComponents.callAction("submit", info);
    }
  },

  'click .deleteShift': function(event, instance) {
    var shiftId = $(event.target).attr("data-id");
    var confirmDelete = confirm("Are you sure you want to delete this shift ?");
    if(confirmDelete) {
      if(shiftId) {
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          Meteor.call("deleteShift", shiftId, function(err) {
            if(err) {
              return alert(err.reason);
            } else {
              $("#shiftProfile").modal("hide");
            }
          });
        }
      }
    }
  },

  'focus .editShiftDate': function(event) {
    event.preventDefault();
    $('.editShiftDate').datetimepicker({
      format: "YYYY-MM-DD"
    });
  },

  'focus .timepicker': function(event) {
    event.preventDefault();
    $(".timepicker").datetimepicker({
      format: "LT",
    });
  }
});