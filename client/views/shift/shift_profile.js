Template.shiftProfile.helpers({
  'shift': function() {
    var shift = Session.get("thisShift");
    if(shift) {
      return shift;
    }
  }
});

Template.shiftProfile.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var shiftId = $(event.target).attr("data-id");
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startTime = $(event.target).find('[name=startTime]').val();
    var endTime = $(event.target).find('[name=endTime]').val();

    if(!startTime || !endTime) {
      alert("Please add start time and end time for your shift");
    } else {
      var shift = Shifts.findOne(shiftId);
      if(shift) {
        if(shift.shiftDate != dateOfShift) {
          if(shift.assignedTo || shift.jobs.length > 0) {
            return alert("You can't change the date");
          }
        }
        var info = {
          "_id": shiftId,
          "shiftDate": dateOfShift,
          "startTime": startTime,
          "endTime": endTime
        }
        Meteor.call("editShift", info, function(err, id) {
          if(err) {
            return alert(err.reason);
          } else {
            $("#shiftProfile").modal("hide");
          }
        });
      }
    }
  },

  'click .deleteShift': function(event, instance) {
    var shiftId = $(event.target).attr("data-id");
    if(shiftId) {
      var shift = Shifts.findOne(shiftId);
      if(shift) {
        Meteor.call("deleteShift", shiftId, function(err) {
          if(err) {
            return alert(err.reason);
          } else {
            $("#shiftProfile").modal("hide");
          }
        });
      }
    }
  }
});