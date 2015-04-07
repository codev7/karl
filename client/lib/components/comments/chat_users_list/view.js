Template.chatUsersList.helpers({
  usersList: function() {
    var users = Meteor.users.find();
    return users;
  }
});