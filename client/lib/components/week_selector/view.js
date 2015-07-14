Template.weekSelector.rendered = function() {
  $('.i-checks').iCheck({
    radioClass: 'iradio_square-green',
  });
}

Template.weekSelector.events({
  'click .saveShifts': function(event) {
    event.preventDefault();
    var weekNo = Session.get("templateToWeek");
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(obj) {
      var index = week.indexOf(obj);
      var shifts = Shifts.find({"shiftDate": index, "type": "template"}).fetch();
      if(shifts.length > 0) {
        shifts.forEach(function(shift) {
          var startHour = moment(shift.startTime).hour();
          var startMin = moment(shift.startTime).minute();

          var endHour = moment(shift.endTime).hour();
          var endMin = moment(shift.endTime).minute();

          var info = {
            "startTime": new Date(moment(obj.date).set('hour', startHour).set("minute", startMin)),
            "endTime": new Date(moment(obj.date).set('hour', endHour).set("minute", endMin)),
            "shiftDate": moment(obj.date).format("YYYY-MM-DD"),
            "section": shift.section,
            "assignedTo": shift.assignedTo,
          }
          Meteor.call("createShift", info, function(err) {
            if(err) {
              console.log(err);
              return;
            } else {
              $("#notifiModal").modal("show");
            }
          });
        });
      }
    });
  },

  'click .checklist-content': function(event) {
    var checked = $(event.target).is(":checked");
    Session.set("templateToWeek", $(event.target).val())
  }
});