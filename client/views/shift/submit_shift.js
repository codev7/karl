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

Template.submitShift.rendered = function() {
  new JsDatePick({
    useMode: 2,
    isStripped: true,
    target: "shiftDate",
    dateFormat: "%Y-%m-%d",
    // selectedDate:{        //This is an example of what the full configuration offers.
    //   day:5,            //For full documentation about these settings please see the full version of the code.
    //   month:9,
    //   year:2006
    // },
    yearsRange: [1978,2040],
    limitToToday: false,
    cellColorScheme: "aqua",
    imgPath: "img/",
    weekStartDay: 1
  });

  $('.timepicker').timepicker();
}
