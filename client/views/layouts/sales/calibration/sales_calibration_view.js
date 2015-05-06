Template.salesCalibrationView.helpers({
  'weekRange': function() {
    var week = Router.current().params.week;
    return week;
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