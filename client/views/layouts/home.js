Template.home.helpers({
  'name': function() {
    var user = Meteor.user();
    if(user) {
      var name = user.username + " ";
      var index = name.indexOf(" ") + 1;
      name = name.slice(0, name.indexOf(" "));
      return name;
    }
  },

  menusCount: function() {
    var count = MenuItems.find().count();
    return count;
  },

  jobsCount: function() {
    var count = JobItems.find().count();
    return count;
  },

  ingCount: function() {
    var count = Ingredients.find().count();
    return count;
  }
});