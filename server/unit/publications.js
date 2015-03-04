Meteor.publish("allConversions", function() {
  return Conversions.find();
});