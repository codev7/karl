Template.userDetailed.events({
  'click .changeUserPermission': function(event) {
    event.preventDefault();
    var type = $(event.target).attr("data-type");
    var id = $(event.target).closest("tr").attr("data-id");
    Meteor.call("changeUserPermission", id, type, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .archiveUser': function(event) {
    event.preventDefault();
    var userId = $(event.target).closest("tr").attr("data-id");
    console.log(userId);
    var user = Meteor.users.findOne(userId);
    if(user) {
      var state = "de-activate";
      if(user.isActive) {
        state = "de-activate";
      } else {
        state = "activate";
      }
      var confirmChange = confirm("Are you sure you want to " + state + " this user");
      console.log(confirmChange);
      if(confirmChange) {
        Meteor.call("changeStatus", userId, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  }
});