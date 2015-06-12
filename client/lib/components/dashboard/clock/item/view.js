Template.clockItem.events({
  'click .clockIn': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    if(id) {
      Meteor.call("clockIn", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  },

  'click .clockOut': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    if(id) {
      Meteor.call("clockOut", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $(".tip").show();
          Session.set("newlyEndedShift", id);
        }
      });
    }
  }
});