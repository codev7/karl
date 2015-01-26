Meteor.publish('jobTypes', function() {
  var cursors = [];
  cursors.push(JobTypes.find());
  logger.info("JobTypes publication");
  return cursors;
});

Meteor.publish("unAssignedJobs", function() {
  var cursors = [];
  var jobs = Jobs.find({"status": "draft"});
  cursors.push(jobs);
  logger.info("Un-assigned jobs publication");
  return cursors;
});