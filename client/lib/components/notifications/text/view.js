Template.notifiText.events({
  'click .confirmClaim': function(event) {
    event.preventDefault();
    var user = $(event.target).attr("data-id");
    var shift = $(event.target).attr("data-shift");
    Meteor.call("confirmClaim", shift, user, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        var text = "Shift claim on " + moment(shift.shiftDate).format("ddd, Do MMMM") + " has been confirmed";
        var options = {
          "title": text,
          "type": "confirm"
        };
        Meteor.call("sendNotifications", shift, "roster", options, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } 
        });
      }
    });
  }
});