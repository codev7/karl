Template.notificationItem.events({
  'click .readNotification': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("readNotifications", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      $(".dropdown-notifi").addClass("open");
    });
  },

  'click .goToItem': function(event) {
    event.preventDefault();
    var ref = $(event.target).attr("data-ref");
    var id = $(event.target).attr("data-id");
    var type = $(event.target).attr("data-type");
    if(type == "job") {
      Router.go("jobItemDetailed", {"_id": ref});   
    } else if(type == "menu") {
      Router.go("menuItemDetail", {"_id": ref});      
    } else if(type == "comment") {
      var notifi = Notifications.findOne(id);
      if(notifi) {
        if(notifi.refType == "menu") {
          Router.go("menuItemDetail", {"_id": ref});  
        } else if(notifi.refType == "job") {
          Router.go("jobItemDetailed", {"_id": ref});  
        }
      }
    }
  }
});