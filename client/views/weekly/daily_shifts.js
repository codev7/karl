Template.dailyShifts.helpers({
  'weekDays': function() {
    var daysOfWeek = getDaysOfWeek(new Date());
    return daysOfWeek;
  },

  'shifts': function() {
    var shifts = Shifts.find();
  },

  'shiftsNWorkers': function() {
    var shiftNWorker = [];
    var shifts = Shifts.find({"shiftDate": this.toString()}).fetch();
    shifts.forEach(function(shift) {
      var doc = {};
      doc.shift = shift.startTime + " - " + shift.endTime;
      if(shift.assignedTo) {
        var worker = Workers.findOne(shift.assignedTo);
        if(worker) {
          doc.worker = worker.name;
        }
      }
      shiftNWorker.push(doc);
    });
    return shiftNWorker;
  }
});

function getDaysOfWeek(date) {
  var curr = new Date(date); // get current date
  var day1 = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var day2 = day1 + 1; // last day is the first day + 6
  var day3 = day1 + 2; // last day is the first day + 6
  var day4 = day1 + 3; // last day is the first day + 6
  var day5 = day1 + 4; // last day is the first day + 6
  var day6 = day1 + 5; // last day is the first day + 6
  var day7 = day1 + 6; // last day is the first day + 6

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  var date1ofWeek = new Date(curr.setDate(day1));
  var date2ofWeek = new Date(curr.setDate(day2));
  var date3ofWeek = new Date(curr.setDate(day3));
  var date4ofWeek = new Date(curr.setDate(day4));
  var date5ofWeek = new Date(curr.setDate(day5));
  var date6ofWeek = new Date(curr.setDate(day6));  
  var date7ofWeek = new Date(curr.setDate(day7));
  var doc = [
    {
      "date": date1ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date1ofWeek.getDay()]
    },
    {
      "date": date2ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date2ofWeek.getDay()]
    },
    {
      "date": date3ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date3ofWeek.getDay()]
    },
    {
      "date": date4ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date4ofWeek.getDay()]
    },
    {
      "date": date5ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date5ofWeek.getDay()]
    },
    {
      "date": date6ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date6ofWeek.getDay()]
    },
    {
      "date": date7ofWeek.toISOString().slice(0,10).replace(/-/g,"-"),
      "day": weekday[date7ofWeek.getDay()]
    }
  ];
  return doc;
}