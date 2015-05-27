Template.home.helpers({
  'name': function() {
    var user = Meteor.user();
    if(user) {
      var name = user.username + " ";
      var index = name.indexOf(" ") + 1;
      name = name.slice(0, name.indexOf(" "));
      return name;
    }
  }
});