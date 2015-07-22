Template.profileMainView.helpers({
  'id': function() {
    var id = Router.current().params._id;
    return id;
  },

  'name': function() {
    var id = Router.current().params._id;
    var user = Meteor.users.findOne(id);
    var loggedIn = Meteor.user();
    if(user) {
      if(user._id == loggedIn._id) {
        return "My Profile";
      } else {
        return user.username + "'s Profile";
      }
    }
  },

  me: function() {
    var id = Router.current().params._id;
    var user = Meteor.userId();
    if(id == user) {
      return true;
    } else {
      return false;
    }
  }
});