Meteor.publish("daily", function(date, worker) {
  var cursors = [];
  //get Shifts
  var query = {
    "shiftDate": new Date(date).toDateString()
  }
  if(worker) {
    query.assignedTo = worker
  }
  var shiftsCursor = Shifts.find(query, {sort: {createdOn: 1}});
  cursors.push(shiftsCursor);
  
  var shifts = shiftsCursor.fetch();
  
  var shiftsList = [];
  shifts.forEach(function(shift) {
    shiftsList.push(shift._id);
  });
  if(shiftsList.length > 0) {
    var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
    cursors.push(jobsCursor);
  }
  logger.info("Daily shift detailed publication");;
  return cursors;
});

Meteor.publish("weekly", function(dates, worker) {
  var cursors = [];
  var firstDate = dates.day1;
  var lastDate = dates.day7;

  var query = {"shiftDate": {$gte: new Date(firstDate).toDateString(), $lte: new Date(lastDate).toDateString()}};
  if(worker) {
    query["assignedTo"] = worker
  }
  //get shifts
  var shiftsCursor = Shifts.find(query);
  cursors.push(shiftsCursor);

  var shifts = shiftsCursor.fetch();
  var workersList = [];
  var shiftsList = [];
  shifts.forEach(function(shift) {
    if(!worker) {
      if(shift.assignedTo) {
        workersList.push(shift.assignedTo);
      }
    }
    shiftsList.push(shift._id);
  });

  //jobs on each shift
  if(shiftsList.length > 0) {
    var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
    cursors.push(jobsCursor);
  }

  //workers on each shift
  if(!worker) {
    if(workersList.length > 0) {
      var workersOnShifts = Workers.find({_id: {$in: workersList}});
      cursors.push(workersOnShifts);
    }
  }
  logger.info("Weekly shifts detailed publication");
  return cursors;
});
