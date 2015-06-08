Meteor.publish('allJobItems', function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  // var permitted = isManagerOrAdmin(this.userId);
  // if(!permitted) {
  //   logger.error("User not permitted to publish all job items");
  //   this.error(new Meteor.Error(404, "User not permitted to publish all jobs"));
  // }
  var cursors = JobItems.find({}, {sort: {'name': 1}, limit: 10});
  return cursors;
});

Meteor.publish("jobItem", function(id) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  // var permitted = isManagerOrAdmin(this.userId);
  // if(!permitted) {
  //   logger.error("User not permitted to publish job item");
  //   this.error(new Meteor.Error(404, "User not permitted to publish job"));
  // }
  var cursors = [];
  cursors.push(JobItems.find(id));
  return cursors;
});

Meteor.publish("menuItemJobItems", function(ids) {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  var cursors = [];
  var items = null;
  if(ids.length > 0) {
    items = JobItems.find({"_id": {$in: ids}}, {sort: {'name': 1}, limit: 10});
  } else {
    items = JobItems.find({}, {sort: {'name': 1}, limit: 10});
  }
  cursors.push(items);
  return cursors;
});