Meteor.publish('jobItems', function() {
  var cursors = JobItems.find();
  return cursors;
});

Meteor.publish("jobItem", function(id) {
  var cursors = [];
  cursors.push(JobItems.find(id));
  return cursors;
});