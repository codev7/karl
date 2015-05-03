Template.dailyShiftScheduling.events({
  'click .today': function(event) {
    event.preventDefault();
    var date = moment().format("YYYY-MM-DD");
    Router.go("dailyShiftScheduling", {"date": date});
  },

  'click .prevDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    date = new Date(date);
    date.setDate(date.getDate() - 1);
    date = moment(date).format("YYYY-MM-DD");
    Router.go("dailyShiftScheduling", {"date": date});
  },

  'click .nextDay': function(event) {
    event.preventDefault();
    var date = Router.current().params.date;
    date = new Date(date);
    date.setDate(date.getDate() + 1);
    date = moment(date).format("YYYY-MM-DD");
    Router.go("dailyShiftScheduling", {"date": date});
  }
});

Template.dailyShiftScheduling.rendered = function() {
  var routeDate = Router.current().params.date;
  console.log(routeDate);
  setTimeout(function() {
    var oneDay = 1000 * 3600 * 24;
    var shifts = Shifts.find({"shiftDate": routeDate}).fetch();
    var date = new Date(0);
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    ShiftsToTime = {};
    TimeToShifts = {};
    var events = []

    shifts.forEach(function(shift) {
      var index = shifts.indexOf(shift);
      ShiftsToTime[shift._id] = index * oneDay;
      TimeToShifts['' + oneDay * index] = shift._id;

      var thisDate = new Date(oneDay * index);
      var thisDay = thisDate.getDate();
      var thisMonth = thisDate.getMonth();
      var thisYear = thisDate.getFullYear();
      var hourFix = 0;

      if(shift.jobs.length > 0) {
        shift.jobs.forEach(function(job) {

          var jobDoc = Jobs.findOne(job);
          var activeTime = jobDoc.activeTime/(3600);
          var activeHours = parseInt(activeTime);
          var activeMins = jobDoc.activeTime%(3600);

          var start = new Date(thisYear, thisMonth, thisDay, hourFix);
          var end = new Date(thisYear, thisMonth, thisDay, activeHours);
          if(activeHours == activeHours) {
            hourFix += parseInt(activeHours);
          }
          var eventObj = {
            "title": jobDoc.name,
            "id": jobDoc._id,
            start: start,
            end: end
          };
          events.push(eventObj);
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
    var shiftCount = shifts.length;

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
      editable: true,
      droppable: true, // this allows things to be dropped onto the calendar
      drop: function(date, event, ui) {
        // debugger;
        var day = date.date() - 1;
        console.log(".event..nadee--------.", ui);
        var shift = TimeToShifts["" + day * oneDay];
        var job = ui.helper.attr("data-id");

        assignJob(job, shift);
      },
      eventDrop: function(event, duration, revertFunc, ui) {
        debugger;
        // alert(event.title + " was dropped on " + event.start.format());
        var day = event.start.date() - 1;
        var shift = TimeToShifts["" + day * oneDay];
        var job = event.id;
        console.log(".event..nadee--------.", shift, job);
        if (!confirm("Are you sure about this change?")) {
          revertFunc();
        } else {
          assignJob(job, shift);
        }
      },
      events: events,
      eventResize: function(event, delta, revertFunc) {
        // debugger;
        // alert(event.title + " end is now " + event.end.format());
        console.log(".............", event.start.format());

        console.log(".............", event.end.format());
        // if (!confirm("is this okay?")) {
        //   revertFunc();
        // }
      }
    });
  }, 1000)
}

function assignJob(job, shift) {
  Meteor.call("assignJob", job, shift, function(err) {
    if(err) {
      console.log(err);
    } else {
      $(this).remove();
    }
  })
}