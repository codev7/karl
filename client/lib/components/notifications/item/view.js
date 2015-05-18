Template.notificationItem.events({
  'click .readNotification': function(event) {
    var id = $(event.target).closest("li").attr("data-id");
    Meteor.call("readNotifications", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});