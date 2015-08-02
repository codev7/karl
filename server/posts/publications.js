Meteor.publish('posts', function(ref) {
    var cursor = [];
    cursor.push(Posts.find({"reference": ref}, {sort: {"createdOn": -1}, limit: 10}));
    logger.info("Posts published", ref);
    return cursor;
});