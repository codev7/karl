Meteor.publish("daily", function(date, worker) {
  var cursors = [];
  //get Shifts
  var query = {
    "shiftDate": new Date(date).getTime()
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

  var query = {"shiftDate": {$gte: new Date(firstDate).getTime(), $lte: new Date(lastDate).getTime()}};
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

Meteor.publish("shift", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  if(!id) {
    logger.error('Shift id not found : ' + id);
    this.error(new Meteor.Error(404, "Shift id not found"));
  }
  var shift = Shifts.find();
  logger.info("Shift published", id);
  return shift;
});

Meteor.publish("rosteredFutureShifts", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  if(!id) {
    logger.error('User id not found : ' + id);
    this.error(new Meteor.Error(404, "User id not found"));
  }
  var shifts = Shifts.find({"assignedTo": id, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  logger.info("Users rostered shifts published", id);
  return shifts;
});

Meteor.publish("rosteredPastShifts", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  if(!id) {
    logger.error('User id not found : ' + id);
    this.error(new Meteor.Error(404, "User id not found"));
  }
  var shifts = Shifts.find({"assignedTo": id, "shiftDate": {$lt: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  logger.info("Users rostered shifts published", id);
  return shifts;
});

Meteor.publish("openedShifts", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var shifts = Shifts.find({"assignedTo": null, "shiftDate": {$gte: new Date().getTime()}}, {sort: {"shiftDate": 1}});
  logger.info("Opened shifts published");
  return shifts;
});
