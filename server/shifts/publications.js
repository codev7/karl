Meteor.publish("daily", function(date, worker) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var query = {
    "shiftDate": new Date(date).getTime(),
    "type": null
  }
  if(worker) {
    query.assignedTo = worker
  }
  var shiftsCursor = Shifts.find(query, {sort: {createdOn: 1}});
  cursors.push(shiftsCursor);
  
  var shifts = shiftsCursor.fetch();
  var shiftsList = [];
  shifts.forEach(function(shift) {
    if(shiftsList.indexOf(shift._id) < 0) {
      shiftsList.push(shift._id);
    }
  });

  if(shiftsList.length > 0) {
    var jobsCursor = Jobs.find({"onshift": {$in: shiftsList}});
    cursors.push(jobsCursor);
  }
  logger.info("Daily shift detailed publication");;
  return cursors;
});

Meteor.publish("weekly", function(dates, worker, type) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var query = {
    "type": type
  };
  
  var cursors = [];
  if(dates && !type) {
    var firstDate = dates.monday;
    var lastDate = dates.sunday;
    query = {"shiftDate": {$gte: new Date(firstDate).getTime(), $lte: new Date(lastDate).getTime()}};
  }
  if(worker) {
    query["assignedTo"] = worker;
  }
  //get shifts
  var shiftsCursor = Shifts.find(query, {sort: {"shiftDate": 1}});

  cursors.push(shiftsCursor);
  logger.info("Weekly shifts detailed publication", {"type": type});
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
  var shift = Shifts.find(id);
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
  var shifts = Shifts.find(
    {"shiftDate": {$gte: new Date().getTime()}, "assignedTo": id, "type": null}, 
    {sort: {"shiftDate": 1}, limit: 10});
  logger.info("Rostered future shifts for user ", id);
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
  var shifts = Shifts.find({
    "shiftDate": {$lte: new Date().getTime()}, 
    "assignedTo": id, 
    "type": null,
    "endTime": {$lte: new Date().getTime()}
  }, 
    {sort: {"shiftDate": -1}, limit: 10});
  logger.info("Rostered past shifts for user ", id);
  return shifts;
});

Meteor.publish("openedShifts", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var shifts = Shifts.find(
    {"shiftDate": {$gte: new Date().getTime()}, "assignedTo": null, "published": true, "type": null}, 
    {sort: {"shiftDate": 1}, limit: 10});
  logger.info("Opened shifts published");
  return shifts;
});
