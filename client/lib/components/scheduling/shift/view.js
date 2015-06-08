Template.shift.rendered = function() {
  TimeToShifts = {};
  var id = Router.current().params._id;
  var businessStartsAt = 8;
  var businessEndsAt = 5;
  var shift = Shifts.findOne(id);
  var events = [];

  if(shift) {
    TimeToShifts['' + shift.shiftDate] = shift._id;
    var thisDate = new Date(shift.shiftDate);
    var thisDay = thisDate.getDate();
    var thisMonth = thisDate.getMonth();
    var thisYear = thisDate.getFullYear();

    var startTime = parseInt(moment(shift.startTime).format("hh"));
    var endTime = parseInt(moment(shift.endTime).format("hh"));
    
    if(businessStartsAt > startTime) {
      businessStartsAt = startTime;
    } 

    if(businessEndsAt < endTime) {
      businessEndsAt = endTime;
    }

    if(shift.jobs.length > 0) {
      shift.jobs.forEach(function(job) {
        var hourFix = 0;
        var minFix = 0;

        var jobDoc = Jobs.findOne(job);
        if(jobDoc) {
          var activeTimeInMins = jobDoc.activeTime/(60);
          var activeHours = parseInt(activeTimeInMins/60);
          var activeMins = parseInt(activeTimeInMins%(60));

          if(jobDoc.startAt) {
            hourFix = moment(jobDoc.startAt).format("HH");
            minFix = moment(jobDoc.startAt).format("mm");
          }
          var start = new Date(thisYear, thisMonth, thisDay, hourFix, minFix);
          start = moment(start).format();
          if(activeHours > 0) {
            hourFix = parseInt(hourFix) + activeHours;
          }
          if(activeMins > 0) {
            minFix += parseInt(activeMins);
          }
          var end = new Date(thisYear, thisMonth, thisDay, hourFix, minFix);
          end = moment(end).format();

          var eventObj = {
            "title": jobDoc.name,
            "id": jobDoc._id,
            "shift": shift ._id,
            start: start,
            end: end
          };

          events.push(eventObj);
        }
      });
    }


    $('#calendar').fullCalendar({
      defaultView: "agendaDay",
      defaultDate: moment(new Date(shift.shiftDate)),
      header: {
        left: null,
        center: null,
        right: null
      },
      businessHours: {
        "start": businessStartsAt + ":00",
        "end": (businessEndsAt + 12) + ":00",
        "dow": [ 0, 1, 2, 3, 4, 5, 6 ]
      },
      allDaySlot: false,
      editable: false,
      droppable: false,
      eventDurationEditable: false,
      events: events
    });  
  }

}