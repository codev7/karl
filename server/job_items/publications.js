Meteor.publish('jobItems', function() {
  var cursors = JobItems.find({}, {sort: {'name': 1}});
  return cursors;
});

Meteor.publish("jobItem", function(id) {
  var cursors = [];
  cursors.push(JobItems.find(id));
  return cursors;
});

Meteor.publish("menuItemJobItems", function(ids) {
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