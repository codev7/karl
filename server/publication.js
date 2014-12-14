Meteor.publish("dailyShift", function(date) {
  var cursors = [];
  //get Jobs
  var jobsCursor = Jobs.find({"refDate": date});
  cursors.push(jobsCursor);
  //get Shifts
  var shiftsCursor = Shifts.find({"shiftDate": date});
  cursors.push(shiftsCursor);

  // get holidays
  var onHoliday = Holidays.find({"date": date});
  cursors.push(onHoliday);

  //get Workers
  // var shifts = shiftsCursor.fetch();
  // var workersList = [];
  // shifts.forEach(function(shift) {
  //   if(shift.assignedTo.length > 0) {
  //     workersList.concat(shift.assignedTo);
  //   }
  // });
  // console.log("------", workersList);

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

Meteor.publish("onHoliday", function(date) {
//   var cursors = [];
//   var onHoliday = Holidays.find({"date": date});
//   cursors.push(onHoliday);
//   return cursors;
});