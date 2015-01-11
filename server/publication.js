Meteor.publish("dailyShift", function(date) {
  var cursors = [];
  //get Shifts
  var shiftsCursor = Shifts.find({"shiftDate": date}, {sort: {createdOn: 1}});
  cursors.push(shiftsCursor);

  // get holidays
  var onHoliday = Holidays.find({"date": date});
  cursors.push(onHoliday);

  //get Workers on shift
  var shifts = shiftsCursor.fetch();
  var workersList = [];
  var shiftsList = [];
  shifts.forEach(function(shift) {
    if(shift.assignedTo) {
      workersList.push(shift.assignedTo);
    }
    shiftsList.push(shift._id);
  });
  if(shiftsList.length > 0) {
    var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
    cursors.push(jobsCursor);
  }
  if(workersList.length > 0) {
    var workersOnShifts = Workers.find({_id: {$in: workersList}});
    cursors.push(workersOnShifts);
  }
  console.log("Daily shift publication");;
  return cursors;
});

Meteor.publish("weeklyShifts", function(dates) {
  var cursors = [];
  var firstDate = dates.day1;
  var lastDate = dates.day7;

  //get shifts
  var shiftsCursor = Shifts.find({"shiftDate": {$gte: firstDate, $lte: lastDate}});
  cursors.push(shiftsCursor);

  var revenueCursor = Revenue.find({"date": {$gte: firstDate, $lte: lastDate}});
  cursors.push(revenueCursor);

  var shifts = shiftsCursor.fetch();
  var workersList = [];
  var shiftsList = [];
  shifts.forEach(function(shift) {
    if(shift.assignedTo) {
      workersList.push(shift.assignedTo);
    }
    shiftsList.push(shift._id);
  });
  if(shiftsList.length > 0) {
    var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
    cursors.push(jobsCursor);
  }
  if(workersList.length > 0) {
    var workersOnShifts = Workers.find({_id: {$in: workersList}});
    cursors.push(workersOnShifts);
  }
  console.log("Weekly shifts publication");
  return cursors;
});

Meteor.publish("jobsToBeCompleted", function() {
  var cursors = [];
  var jobs = Jobs.find({"status": "draft"});
  cursors.push(jobs);
  return cursors;
});

Meteor.publish("availableWorkers", function(date) {
  var cursors = [];
  var busyWorkers = [];
  var onShiftWorkers = [];
  var onHolidayWorkers = [];
  var shifts = Shifts.find({'shiftDate': date}).fetch();
  if(shifts.length > 0) {
    shifts.forEach(function(shift) {
      if(shift.assignedTo) {
        onShiftWorkers.push(shift.assignedTo);
      }
    });
  }
  var holidays = Holidays.findOne({"date": date});
  if(holidays) {
    if(holidays.users.length > 0) {
      onHolidayWorkers = holidays.users;
    }
  }
  busyWorkers = onShiftWorkers.concat(onHolidayWorkers);
  var workers = Workers.find({_id: {$nin: busyWorkers}, 'resign': false});
  return workers;
});

Meteor.publish("admin", function() {
  var cursors = [];
  cursors.push(Workers.find());
  cursors.push(WorkerTypes.find());
  cursors.push(JobTypes.find());
  return cursors;
});

Meteor.publish('workerTypes', function() {
  var cursors = [];
  cursors.push(WorkerTypes.find());
  return cursors;
});

Meteor.publish('jobTypes', function() {
  var cursors = [];
  cursors.push(JobTypes.find());
  return cursors;
});

