Meteor.publish("activeWorkers", function(date) {
  var cursors = [];
  var busyWorkers = [];
  var onShiftWorkers = [];
  var onHolidayWorkers = [];
  var shifts = Shifts.find({'shiftDate': date}).fetch();

  //workers on shifts
  if(shifts.length > 0) {
    shifts.forEach(function(shift) {
      if(shift.assignedTo) {
        onShiftWorkers.push(shift.assignedTo);
      }
    });
  }
  //workers on holiday
  var holidays = Holidays.findOne({"date": date});
  if(holidays) {
    if(holidays.users.length > 0) {
      onHolidayWorkers = holidays.users;
    }
  }
  //all busy workers
  busyWorkers = onShiftWorkers.concat(onHolidayWorkers);
  //active workers
  var workers = Workers.find({_id: {$nin: busyWorkers}, 'resign': false});
  logger.info("ActiveWorkers publication");
  return workers;
});

Meteor.publish("assignedWorkers", function(date) {
  var assignedWorkers = [];
  var shifts = Shifts.find({'shiftDate': date}).fetch();
  //workers on shifts
  if(shifts.length > 0) {
    shifts.forEach(function(shift) {
      if(shift.assignedTo) {
        assignedWorkers.push(shift.assignedTo);
      }
    });
  }
  var workersCursor = Workers.find({_id: {$in: assignedWorkers}, 'resign': false});
  logger.info("Assigned Workers publication");
  return workersCursor;
});

Meteor.publish("allWorkers", function() {
  var cursors = [];
  cursors.push(Workers.find());
  logger.info("All workers publication");
  return cursors;
});

Meteor.publish('workerTypes', function() {
  var cursors = [];
  cursors.push(WorkerTypes.find());
  logger.info("WorkerTypes publication");
  return cursors;
});