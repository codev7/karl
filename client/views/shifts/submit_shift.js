Template.submitShift.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startTime = $(event.target).find('[name=startTime]').val().trim();
    var endTime = $(event.target).find('[name=endTime]').val().trim();

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
    console.log(dateOfShift, startTime, endTime)
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
        "endTime": dateObj_end
      }
      Meteor.call("createShift", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#submitShiftModal").modal("hide");
        }
      });
    }
  },

  'focus .form_date': function(event) {
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

  'focus .form_time': function(event) {
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

Template.submitShift.helpers({
  'today': function() {
    var today = new Date();
    today = moment(today).format("YYYY-MM-DD");
    return today;
  }
});
