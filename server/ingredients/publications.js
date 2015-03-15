Meteor.publish("allIngredients", function() {
  var cursors = Ingredients.find({}, {sort: {'code': 1}});
  return cursors;
});

Meteor.publish("ingredients", function(ids) {
  var cursors = [];
  var ings = null;
  if(ids.length > 0) {
    ings = Ingredients.find({"_id": {$in: ids}}, {sort: {'code': 1}, limit: 10});
  } else {
    ings = Ingredients.find({}, {sort: {'code': 1}, limit: 10});
  }
  cursors.push(ings);
  return cursors;
});

Meteor.publish("ingredientsSearch", function(searchText, notInIds) {
  var ingredients = null;
  var query = {};
  var cursors = [];
  var filter = null;

  if(searchText) {
    filter = new RegExp(searchText, 'i');
  }
  if(notInIds.length > 0) {
    query["_id"] = {$nin: notInIds};
  }
  if(filter) {
    query = {"code": filter};
  }
  cursors = Ingredients.find(query, {sort: {'code': 1}, limit: 10});
  return cursors;
});