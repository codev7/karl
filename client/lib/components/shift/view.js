Template.shiftItem.events({
  'click .claimShift': function(event) {
    event.preventDefault();
    var shiftId = $(event.target).closest("tr").attr("data-id");
    var shift = Shifts.findOne(shiftId);
    if(shiftId && shift) {
      Meteor.call("claimShift", shiftId, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var text = "Shift on " + moment(shift.shiftDate).format("ddd, Do MMMM");
          var options = {
            "title": text + " has been claimed by workers",
            "type": "claim"
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