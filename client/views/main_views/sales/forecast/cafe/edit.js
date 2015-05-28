Template.weeklySalesForecastMenusListView.helpers({
  'title': function() {
    var week = Router.current().params.week;
    var date = moment().day("Monday").week(week).format("Do of MMMM YYYY");
    return "Edit Cafe Sales Forecasting for the week starting from " + date;
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