Template.weeklyForecastListMainView.helpers({
  title: function() {
    var week = Router.current().params.week;
    var date = moment().day("Monday").week(week).format("Do of MMMM YYYY");
    return "Cafe Sales Forecasting for the week starting from " + date;
  }

});
    