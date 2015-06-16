var component = FlowComponents.define("successAlert", function(props) {
});

component.state.isDailyRoster = function() {
  var route =  Router.current().route.getName();
  if(route == "dailyRoster") {
    return true;
  } else {
    return false;
  }
}


component.state.isWeeklyRoster = function() {
  var route =  Router.current().route.getName();
  if(route == "weeklyRoster") {
    return true;
  } else {
    return false;
  }
}