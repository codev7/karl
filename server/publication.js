Meteor.publish("dailyShift", function(date) {
  var cursors = [];
  //get Jobs
  var jobsCursor = Jobs.find({"refDate": date});
  cursors.push(jobsCursor);
  //get Shifts
  var shiftsCursor = Shifts.find({"shiftDate": date}, {sort: {createdOn: 1}});
  cursors.push(shiftsCursor);

  // get holidays
  var onHoliday = Holidays.find({"date": date});
  cursors.push(onHoliday);

  //get Workers on shift
  var shifts = shiftsCursor.fetch();
  var workersList = [];
  shifts.forEach(function(shift) {
    if(shift.assignedTo) {
      workersList.push(shift.assignedTo);
    }
  });
  if(workersList.length > 0) {
    var workersOnShifts = Workers.find({_id: {$in: workersList}});
    cursors.push(workersOnShifts);
  }
  // cursors.push(workersList);

  // var ownersCursor = Meteor.users.find({_id: {$in: owners}}, {fields: {username: 1, profile: 1}});
  // cursors.push(ownersCursor);

  // console.log(cursors);
  return cursors;
});

Meteor.publish("weeklyShifts", function(startDate, endDate) {
  var cursors = [];

  //get jobs
  var jobs = Jobs.aggregate([ { $match: {"refDate": {$gte: startDate, $lte: endDate}}}]);
  console.log(jobs);
  cursors.push(jobs);

  //get shifts
  // var shifts = Shifts.
});

Meteor.publish("jobsToBeCompleted", function() {
  var cursors = [];
  var jobs = Jobs.find({"status": "draft"});
  cursors.push(jobs);
  return cursors;
});

Meteor.publish("allWorkers", function() {
  var cursors = [];
  var workers = Workers.find();
  cursors.push(workers);
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
  var workers = Workers.find({_id: {$nin: busyWorkers}});
  return workers;
});