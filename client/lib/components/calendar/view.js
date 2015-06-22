Template.calendar.rendered = function() {
  $('#calendar').datetimepicker({
    inline: true,
    sideBySide: false,
    showTodayButton: true,
    showClear: true,
    viewMode: 'days',
    format: 'DD/MM/YYYY'
  }).on("dp.change", function(result) {
    if(result) {
      $(".active").closest("tr").addClass("active");
      var weekNo = moment(result.date).week();
      var week = getDatesFromWeekNumber(weekNo)
      console.log("...........", week);
      $("tr.active").find("td").addClass('active');
      Session.set("templateToWeek", week);
    }
  });
}

Template.calendar.events({
  'click .saveShifts': function(event) {
    event.preventDefault();
    var week = Session.get("templateToWeek");
    week.forEach(function(obj) {
      var index = week.indexOf(obj);
      var shifts = LocalShifts.find({"shiftDate": index}).fetch();
      if(shifts.length > 0) {
        shifts.forEach(function(shift) {
          var startHour = moment(shift.startTime).hour();
          var endHour = moment(shift.endTime).hour();
          console.log(".........startHour...............", startHour, endHour);
          var info = {
            "startTime": new Date(moment(obj.date).set('hour', startHour)),
            "endTime": new Date(moment(obj.date).set('hour', endHour)),
            "shiftDate": obj.date,
            "section": shift.section,
            "assignedTo": shift.assignedTo,
          }
          console.log("......info.........", info);
          Meteor.call("createShift", info, function(err) {
            if(err) {
              console.log(err);
              return;
            }
          });
        });
      }

      console.log("...............");

    });
  }
});