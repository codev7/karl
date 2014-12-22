Template.dailyShifts.helpers({
  'weekDays': function() {
    var daysOfWeek = getDaysOfWeek(new Date());
    console.log(daysOfWeek);
    return daysOfWeek;
  },

  'shifts': function() {
    var shifts = Shifts.find();
  },

  'shiftsNWorkers': function() {
    var shiftNWorker = [];
    console.log("this.toString()", this.toString());
    var shifts = Shifts.find({"shiftDate": this.toString()}).fetch();
    console.log("------", shifts);
    shifts.forEach(function(shift) {
      console.log("---------sh", shift);
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
    console.log("this------", shiftNWorker);
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

  var day1ofWeek = new Date(curr.setDate(day1)).toISOString().slice(0,10).replace(/-/g,"-");
  var day2ofWeek = new Date(curr.setDate(day2)).toISOString().slice(0,10).replace(/-/g,"-");
  var day3ofWeek = new Date(curr.setDate(day3)).toISOString().slice(0,10).replace(/-/g,"-");
  var day4ofWeek = new Date(curr.setDate(day4)).toISOString().slice(0,10).replace(/-/g,"-");
  var day5ofWeek = new Date(curr.setDate(day5)).toISOString().slice(0,10).replace(/-/g,"-");
  var day6ofWeek = new Date(curr.setDate(day6)).toISOString().slice(0,10).replace(/-/g,"-");  
  var day7ofWeek = new Date(curr.setDate(day7)).toISOString().slice(0,10).replace(/-/g,"-");
  return [day1ofWeek, day2ofWeek, day3ofWeek, day4ofWeek, day5ofWeek, day6ofWeek, day7ofWeek]
}