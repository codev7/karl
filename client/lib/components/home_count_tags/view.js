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
    var count = 0;
    Meteor.call("menuItemsCount", function(err, result) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        console.log(result);
        count = result;
      }
    });
    return count;
  },

  // jobsCount: function() {
   
  // },

  // ingCount: function() {
   
  // }
});