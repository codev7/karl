Template.submitShift.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var dateOfShift = $(event.target).find('[name=dateOfShift]').val();
    var startTime = $(event.target).find('[name=startTime]').val();
    var endTime = $(event.target).find('[name=endTime]').val();

    if(!startTime || !endTime) {
      alert("Please add start time and end time for your shift");
    } else {
      var info = {
        "shiftDate": dateOfShift,
        "startTime": startTime,
        "endTime": endTime
      }
      Meteor.call("createShift", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#submitShiftModal").modal("hide");
        }
      });
    }
  }
});
