Meteor.publish('allJobItems', function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = JobItems.find({"status": "active"}, {sort: {'name': 1}});
  logger.info("All job items published");
  return cursors;
});

Meteor.publish("jobItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var jobsItems = null;
  if(ids.length > 0) {
    jobsItems = JobItems.find({"_id": {$in: ids}}, {sort: {'code': 1}});
  } else {
    jobsItems = JobItems.find({}, {sort: {'code': 1}, limit: 10});
  }
  cursors.push(jobsItems);
  logger.info("Job items published", ids);
  return cursors;
});