Meteor.publish("allSections", function() {
  return Sections.find();
});

Meteor.publish("allCategories", function() {
  if(!this.userId) {
    logger.error('User not found : ' + this.userId);
    this.error(new Meteor.Error(404, "User not found"));
  }
  return Categories.find();
});