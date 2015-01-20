Meteor.publish("daily", function(date) {
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
  logger.info("Daily shift detailed publication");;
  return cursors;
});

Meteor.publish("weekly", function(dates) {
  var cursors = [];
  var firstDate = dates.day1;
  var lastDate = dates.day7;

  //get shifts
  var shiftsCursor = Shifts.find({"shiftDate": {$gte: firstDate, $lte: lastDate}});
  cursors.push(shiftsCursor);

  //revenues on each date
  var salesCursor = Sales.find({"date": {$gte: firstDate, $lte: lastDate}});
  cursors.push(salesCursor);

  var shifts = shiftsCursor.fetch();
  var workersList = [];
  var shiftsList = [];
  shifts.forEach(function(shift) {
    if(shift.assignedTo) {
      workersList.push(shift.assignedTo);
    }
    shiftsList.push(shift._id);
  });

  //jobs on each shift
  if(shiftsList.length > 0) {
    var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
    cursors.push(jobsCursor);
  }

  //workers on each shift
  if(workersList.length > 0) {
    var workersOnShifts = Workers.find({_id: {$in: workersList}});
    cursors.push(workersOnShifts);
  }
  logger.info("Weekly shifts detailed publication");
  return cursors;
});
