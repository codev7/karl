Meteor.publish('jobTypes', function() {
  var cursors = [];
  cursors.push(JobTypes.find());
  logger.info("JobTypes publication");
  return cursors;
});

Meteor.publish("unAssignedJobs", function() {
  var cursors = [];
  var jobs = Jobs.find({"status": "draft", 'onshift': null}, {limit: 10});
  cursors.push(jobs);
  logger.info("Un-assigned jobs publication");
  return cursors;
});


Meteor.publish("jobs", function(ids) {
  var cursors = [];
  var jobs = Jobs.find({"_id": {$in: ids}}, {limit: 10});
  cursors.push(jobs);
  logger.info("Jobs publication");
  return cursors;
});