var subs = new SubsManager();

var component = FlowComponents.define("dailyForecastList", function(props) {
  this.set("list", []);
});

component.state.week = function() {
  var week = Router.current().params.week;
  var daysOfWeek = [];
  var monday = moment().day("Monday").week(week).format("YYYY-MM-DD");
  daysOfWeek.push(monday);

  var tuesday = moment().day("Tuesday").week(week).format("YYYY-MM-DD");
  daysOfWeek.push(tuesday);

  var wednesday = moment().day("WednesDay").week(week).format("YYYY-MM-DD");
  daysOfWeek.push(wednesday);

  var thursday = moment().day("Thursday").week(week).format("YYYY-MM-DD");
  daysOfWeek.push(thursday);

  var friday = moment().day("Friday").week(week).format("YYYY-MM-DD");
  daysOfWeek.push(friday);

  var saturday = moment().day("Saturday").week(week).format("YYYY-MM-DD");
  daysOfWeek.push(saturday);

  var sunday = moment().day("Sunday").week(parseInt(week) + 1).format("YYYY-MM-DD");
  daysOfWeek.push(sunday);


  var first = new Date(monday).getTime();
  var last = new Date(sunday).getTime();
  subs.subscribe("forecastPerWeek", first, last);

  var query = {"date": {$gte: first, $lte: last}};
  var weekForecast = ForecastCafe.find(query).count();
  if(weekForecast <= 0) {
    daysOfWeek.forEach(function(day) {
      Meteor.call("createForecast", day, function(err) {
        if(err) {
          console.log(err);
        }
      });  
    });
  }
  var thisWeek = ForecastCafe.find(query);
  return thisWeek;
}

component.state.expectedTotalRevenue = function() {
  var week = Router.current().params.week;
  var monday = moment().day("Monday").week(week).format("YYYY-MM-DD");
  var sunday = moment().day("Sunday").week(parseInt(week) + 1).format("YYYY-MM-DD");

  var first = new Date(monday).getTime();
  var last = new Date(sunday).getTime();
  subs.subscribe("forecastPerWeek", first, last);

  var query = {"date": {$gte: first, $lte: last}};
  var forecastPerWeek = ForecastCafe.find(query).fetch();
  var total = 0;
  if(forecastPerWeek.length > 0) {
    forecastPerWeek.forEach(function(item) {
      total += parseFloat(item.expectedRevenue);
    });
  }
  return total;
}