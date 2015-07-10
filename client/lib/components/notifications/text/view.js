Template.notifiText.events({
  'click .confirmClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).attr("data-id");
    var shiftId = $(event.target).attr("data-shift");
    var shift = Shifts.findOne(shiftId);
    if(shift) {
      Meteor.call("confirmClaim", shiftId, user, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been confirmed";
          var options = {
            "title": text,
            "type": "confirm"
          };
          Meteor.call("sendNotifications", shiftId, "roster", options, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } 
          });
        }
      });
    }
  },

  'click .rejectClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).attr("data-id");
    var shiftId = $(event.target).attr("data-shift");
    var shift = Shifts.findOne(shiftId);
    if(shift) {
      Meteor.call("rejectClaim", shiftId, user, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been rejected";
          var options = {
            "title": text,
            "type": "reject",
            "rejected": user
          };
          Meteor.call("sendNotifications", shiftId, "roster", options, function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            } 
          });
        }
      });
    }
  }
});