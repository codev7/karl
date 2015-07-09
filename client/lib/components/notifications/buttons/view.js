Template.notifiButtons.events({
  'click .readNotification': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    $(".dropdown-notifi").addClass("open");
    Meteor.call("readNotifications", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
      $(".dropdown-notifi").addClass("open");
    });
    $(".dropdown-notifi").addClass("open");

  },

  'click .goToItem': function(event) {    
    event.preventDefault();
    var ref = $(event.target).attr("data-ref");
    var id = $(event.target).attr("data-id");
    var type = $(event.target).attr("data-type");
    var notifi = Notifications.findOne(id);
    if(notifi) {
      if(type == "job") {
        Router.go("jobItemDetailed", {"_id": ref});   
      } else if(type == "menu") {
        Router.go("menuItemDetail", {"_id": ref});      
      } else if(type == "comment") {
          if(notifi.refType == "menu") {
            Router.go("menuItemDetail", {"_id": ref});  
          } else if(notifi.refType == "job") {
            Router.go("jobItemDetailed", {"_id": ref});  
          }
      } else if(type == "roster") {
        if(notifi.actionType == "publish") {
          Router.go("weeklyRoster", {"week": ref});
        } else if(notifi.actionType == "confirm" || notifi.actionType == "claim") {
          Router.go("shift", {"_id": ref});
        }
      }
    }
  }
});