Template.weeklySalesForecastMenusListView.helpers({
  'week': function() {
    var week = Router.current().params.week;
    var monday = moment().day("Monday").week(week).format("YYYY-MM-DD");
    var sunday = moment().day("Sunday").week(parseInt(week) + 1).format("YYYY-MM-DD");
    var dateRange = monday + " - " + sunday;
    return dateRange;
  }
});

Template.weeklySalesForecastMenusListView.events({
  'click .thisWeek': function(event) {
    event.preventDefault();
    var week = moment().format("w");
    Router.go("weeklySalesForecastMenusList", {"week": week});
  },

  'click .nextWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) + 1;
    Router.go("weeklySalesForecastMenusList", {"week": week});
  },

  'click .previousWeek': function(event) {
    event.preventDefault();
    var week = parseInt(Router.current().params.week) - 1;
    Router.go("weeklySalesForecastMenusList", {"week": week});
  },

  'click .goBack': function(event) {
    event.preventDefault();
    var week = Router.current().params.week;
    Router.go("cafeSalesForecast", {"week": week});
  }
});