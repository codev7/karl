Template.dailyShiftScheduling.events({
  'click .editShiftProfile': function(event) {
    event.preventDefault();
    var shiftId = $(event.target).attr("data-id");
    Session.set("thisShift", shiftId);
    $("#shiftProfile").modal();
  },

  'click .fc-title': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var shiftId = $(event.target).attr("data-shift");
    Session.set("thisJob", id);
    Session.set("shiftId", shiftId);
    $(".theme-config-box").toggleClass("show");
    // $("#jobProfile").modal();
  },

  'change .selectWorkers': function(event) {
    var workerId = $(event.target).val();
    var shiftId = $(event.target).attr("data-id");
    Meteor.call("assignWorker", workerId, shiftId, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
        $(event.target).val("");
        return;
      }
    });
  },

  'click .generateRecurring': function(event) {
    event.preventDefault();
    Meteor.call("generateRecurrings", new Date(), function(err, result) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        console.log(result);
      }
    });
  }
});

Template.dailyShiftScheduling.rendered = function() {
  var routeDate = Router.current().params.date;
  setTimeout(function() {
    var oneDay = 1000 * 3600 * 24;
    var shifts = Shifts.find({"shiftDate": new Date(routeDate).toDateString()});
    var businessStartsAt = 8;
    var businessEndsAt = 5;
    if(shifts) {
      Tracker.autorun(function() {
        var date = new Date(0);
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();

        ShiftsToTime = {};
        TimeToShifts = {};
        var events = []
        var fetchedShifts = shifts.fetch();
        fetchedShifts.forEach(function(shift) {
          var index = fetchedShifts.indexOf(shift);
          ShiftsToTime[shift._id] = index * oneDay;
          TimeToShifts['' + oneDay * index] = shift._id;

          var thisDate = new Date(oneDay * index);
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
        });
        $('#external-events div.external-event').each(function() {
          // store data so the calendar knows to render an event upon drop
          $(this).data('event', {
            title: $.trim($(this).text()), // use the element's text as the event title,
            id: $(this).attr("data-id"),
            stick: true // maintain when user navigates (see docs on the renderEvent method)
          });
          // make the event draggable using jQuery UI
          $(this).draggable({
            zIndex: 1111999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
          });
        });


        /* initialize the calendar
        -----------------------------------------------------------------*/
        var shiftCount = fetchedShifts.length;

        if(shiftCount > 0) {
          if($('#calendar')) {
            $('#calendar').fullCalendar('destroy')
          }

          $('#calendar').fullCalendar({
            defaultView: "agendaShifts",
            defaultDate: moment(new Date(0)),
            header: {
              left: null,
              center: null,
              right: null
            },
            views: {
              "agendaShifts": {
                type: "agenda",
                duration: {days: shiftCount}
              }
            },
            businessHours: {
              "start": businessStartsAt + ":00",
              "end": (businessEndsAt + 12) + ":00",
              "dow": [ 0, 1, 2, 3, 4, 5, 6 ]
            },
            allDaySlot: false,
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            eventDurationEditable: false,
            drop: function(date, event, ui) {
              // debugger;
              var day = date.date() - 1;
              var shift = TimeToShifts["" + day * oneDay];
              var job = ui.helper.attr("data-id").trim();
              var startTime = date.format();
   
              assignJob(job, shift, startTime);
            },
            eventDrop: function(event, duration, revertFunc, ui) {
              // alert(event.title + " was dropped on " + event.start.format());
              var day = event.start.date() - 1;
              var shift = TimeToShifts["" + day * oneDay];
              var job = event.id;
              var startTime = event.start.format();

              if (!confirm("Are you sure about this change?")) {
                revertFunc();
              } else {
                assignJob(job, shift, startTime);
              }
            },
            events: events
          });    
        }       
      });
    }
  }, 1000);
}

function assignJob(job, shift, startAt) {
  Meteor.call("assignJob", job, shift, startAt, function(err) {
    if(err) {
      console.log(err);
    } else {
      $(this).remove();
    }
  })
}