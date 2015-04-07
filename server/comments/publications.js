Meteor.publish('comments', function(ref) {
  var cursor = [];
  cursor.push(Comments.find({"reference": ref}));
  return cursor;
});