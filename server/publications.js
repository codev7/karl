Meteor.publish("allSections", function() {
  return Sections.find();
});
