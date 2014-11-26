Meteor.publish("dailyShift", function(date) {
  var cursors = [];
  //get Jobs
  var jobsCursor = Jobs.find({"createdOn": date});
  cursors.push(jobsCursor);
  
  //get Shifts
  var shiftsCursor = Shifts.find({"createdOn": date});
  cursors.push(shiftsCursor);

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

Meteor.publish("availableWorkers", function() {
  var cursors = [];
  var workers = Workers.find();
  cursors.push(workers);
  return cursors;
});