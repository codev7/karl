Template.shiftProfile.helpers({
  'shift': function() {
    var shift = Session.get("thisShift");
    if(shift) {
      return shift;
    }
  }
});

Template.shiftProfile.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var shiftId = $(event.target).attr("data-id");
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startingTime = $(event.target).find('[name=startingTime]').val().trim();
    var endingTime = $(event.target).find('[name=endingTime]').val().trim();

    var starting_hours = parseInt(startingTime.slice(0, startingTime.indexOf(":")).trim());
    var starting_mins = parseInt(startingTime.slice(startingTime.indexOf(":") + 1, startingTime.indexOf(" ")).trim());
    var starting_light = startingTime.slice(startingTime.indexOf(" "), 8).trim();
    if(starting_light == "PM") {
      starting_hours += 12;
    }
    
    var dateObj_starting = new Date(dateOfShift);
    dateObj_starting.setHours(starting_hours, starting_mins)
    
    var ending_hours = parseInt(endingTime.slice(0, endingTime.indexOf(":")).trim());
    var ending_mins = parseInt(endingTime.slice(endingTime.indexOf(":") + 1, endingTime.indexOf(" ")).trim());
    var ending_light = endingTime.slice(endingTime.indexOf(" "), 8).trim();
    if(ending_light == "PM") {
      ending_hours += 12;
    }

    var dateObj_ending = new Date(dateOfShift);
    dateObj_ending.setHours(ending_hours, ending_mins);

    if(!dateObj_starting && !dateObj_ending) {
      alert("Please add starting time and end time for your shift");
      return;
    } else if(dateObj_starting.getTime() == dateObj_ending.getTime()) {
      alert("Invalid shift start end time combination");
      return;
    } else if(dateObj_starting.getTime() > dateObj_ending.getTime()) {
      alert("Invalid shift end time");
      return;
    } else {
      var shift = Shifts.findOne(shiftId);
      if(shift) {
        if(shift.shiftDate != dateOfShift) {
          if(shift.assignedTo || shift.jobs.length > 0) {
            return alert("You can't change the date");
          }
        }
      }
      var info = {
         "_id": shiftId,
        "shiftDate": dateOfShift,
        "startTime": dateObj_starting,
        "endTime": dateObj_ending
      }
      Meteor.call("editShift", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#shiftProfile").modal("hide");
        }
      });
    }
  },

  'click .deleteShift': function(event, instance) {
    var shiftId = $(event.target).attr("data-id");
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
  },

  'focus .shiftDate': function(event) {
    $('.form_date').datetimepicker({
      language:  'fr',
      weekStart: 1,
      todayBtn:  1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      minView: 2,
      forceParse: 0
    }).
    on('changeDate', function(ev){
      $(".timepicker")[0].focus();
    });
  },

  'focus .timepicker': function(event) {
    $(".form_time").datetimepicker({
      language:  'fr',
      todayBtn:  1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 1,
      minView: 0,
      maxView: 1,
      forceParse: 0
    })
    .on('changeMinute', function(ev){
      $(".timepicker")[1].focus();
    });
  }
});