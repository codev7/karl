Template.workersList.rendered = function() {
  // this.autorun(function() {
  // });  
}

Template.workersList.helpers({
  "workers": function() {
    var shifts = Shifts.find({'shiftDate': Session.get("thisDate")}).fetch();
    var busyWorkers = [];
    var onShiftWorkers = [];
    var onHolidayWorkers = [];
    if(shifts.length > 0) {
      shifts.forEach(function(shift) {
        if(shift.assignedTo) {
          onShiftWorkers.push(shift.assignedTo);
        }
      });
    }
    var holidays = Holidays.findOne({"date": Session.get("thisDate")});
    if(holidays) {
      if(holidays.users.length > 0) {
        onHolidayWorkers = holidays.users;
      }
    }
    busyWorkers = onShiftWorkers.concat(onHolidayWorkers);
    var workers = Workers.find({_id: {$nin: busyWorkers}}).fetch();
    return workers;
  }
});