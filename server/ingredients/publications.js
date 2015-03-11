Meteor.publish("ingredients", function() {
  var cursors = Ingredients.find();
  return cursors;
});