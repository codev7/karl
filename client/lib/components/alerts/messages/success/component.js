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


component.state.isTemplateWeeklyRoster = function() {
  var route =  Router.current().route.getName();
  if(route == "templateWeeklyRoster") {
    return true;
  } else {
    return false;
  }
}