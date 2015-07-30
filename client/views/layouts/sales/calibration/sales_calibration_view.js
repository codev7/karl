Template.salesCalibrationView.helpers({
  'week': function() {
    var week = Router.current().params.week;
    var monday = moment().day("Monday").week(week).format("YYYY-MM-DD");
    var sunday = moment().day("Sunday").week(parseInt(week) + 1).format("YYYY-MM-DD");
    var dateRange = monday + " - " + sunday;
    return dateRange;
  }
});

Template.salesCalibrationView.events({
  'click .thisWeek': function(event) {
    event.preventDefault();
    var week = moment(new Date()).format("w");
    Router.go("salesCalibration", {"week": week});
  },

  'click .previousWeek': function(event) {
    event.preventDefault();
    var week = Router.current().params.week;
    week = parseInt(week) - 1;
    Router.go("salesCalibration", {"week": week});
  },


  'click .nextWeek': function(event) {
    event.preventDefault();
    var week = Router.current().params.week;
    week = parseInt(week) + 1;
    Router.go("salesCalibration", {"week": week});
  }
});