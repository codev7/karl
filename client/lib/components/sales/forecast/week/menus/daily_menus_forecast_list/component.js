var subs = new SubsManager();
var component = FlowComponents.define("dailyMenusForecastList", function(props) {

});

component.state.forecastPerWeek = function() {
  var week = Router.current().params.week;
  subs.clear();

  var monday = moment().day("Monday").week(week).format("YYYY-MM-DD");
  var sunday = moment().day("Sunday").week(parseInt(week) + 1).format("YYYY-MM-DD");

  var first = new Date(monday).getTime();
  var last = new Date(sunday).getTime();
  subs.subscribe("forecastPerWeek", first, last);

  var query = {"date": {$gte: first, $lte: last}};
  var weekForecast = ForecastCafe.find(query);
  return weekForecast;
}