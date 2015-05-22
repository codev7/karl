Template.notificationItem.events({
  'click .readNotification': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("readNotifications", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .goToItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var type = $(event.target).attr("data-type");
    if(type == "job") {
      Router.go("jobItemDetailed", {"_id": id});   
    } else if(type == "menu") {
      Router.go("menuItemDetail", {"_id": id});      
    }
  }
});