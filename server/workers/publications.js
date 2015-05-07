// Meteor.publish("activeWorkers", function(date) {
//   var cursors = [];
//   var busyWorkers = [];
//   var onShiftWorkers = [];
//   var onHolidayWorkers = [];
//   //workers on holiday
//   var holidays = Holidays.findOne({"date": date});
//   if(holidays) {
//     if(holidays.workers) {
//       if(holidays.workers.length > 0) {
//         onHolidayWorkers = holidays.workers;
//       }
//     }
//   }
//   var workers = Workers.find({_id: {$nin: onHolidayWorkers}, 'resign': false});
//   logger.info("ActiveWorkers publication");
//   return workers;
// });

// Meteor.publish("assignedWorkers", function(date) {
//   var assignedWorkers = [];
//   var shifts = Shifts.find({'shiftDate': date}).fetch();
//   //workers on shifts
//   if(shifts.length > 0) {
//     shifts.forEach(function(shift) {
//       if(shift.assignedTo) {
//         assignedWorkers.push(shift.assignedTo);
//       }
//     });
//   }
//   var workersCursor = Workers.find({_id: {$in: assignedWorkers}, 'resign': false});
//   logger.info("Assigned Workers publication");
//   return workersCursor;
// });

// Meteor.publish("allWorkers", function() {
//   var cursors = [];
//   cursors.push(Workers.find());
//   logger.info("All workers publication");
//   return cursors;
// });

// Meteor.publish('workerTypes', function() {
//   var cursors = [];
//   cursors.push(WorkerTypes.find());
//   logger.info("WorkerTypes publication");
//   return cursors;
// });

// Meteor.publish("monthlyHolidays", function(start, end) {
//   var cursors = [];
//   var holidays = Holidays.find({"date": {$gte: start, $lte: end}});
//   cursors.push(holidays);
//   logger.info("Holiday published");
//   return cursors;
// });


Meteor.publish("workers", function() {
  var cursors = [];
  cursors.push(Meteor.users.find({"isWorker": true}));
  return cursors;
});