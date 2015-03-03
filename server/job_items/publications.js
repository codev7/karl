Meteor.publish('jobItems', function() {
  var cursors = JobItems.find();
  return cursors;
});