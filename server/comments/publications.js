Meteor.publish('comments', function(ref) {
  var cursor = [];
  cursor.push(Comments.find({"reference": ref}, {sort: {"createdOn": -1}, limit: 10}));
  logger.info("Comments published", ref);
  return cursor;
});