Template.weeklyForecastListView.helpers({
  'week': function() {
    var week = Router.current().params.week;
    var monday = moment().day("Monday").week(week).format("YYYY-MM-DD");
    var sunday = moment().day("Sunday").week(parseInt(week) + 1).format("YYYY-MM-DD");
    var dateRange = monday + " - " + sunday;
    return dateRange;
  }
});

Template.weeklyForecastListView.events({
  'click .thisWeek': function(event) {
    event.preventDefault();
    var week = moment().format("w");
    Router.go("cafeSalesForecast", {"week": week});
  },

  'click .nextWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) + 1;
    Router.go("cafeSalesForecast", {"week": week});
  },

  'click .previousWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) - 1;
    Router.go("cafeSalesForecast", {"week": week});
  }
});