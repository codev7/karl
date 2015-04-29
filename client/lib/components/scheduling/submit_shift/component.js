var component = FlowComponents.define("submitShift", function(props) {
});

component.state.today = function() {
  var date = Router.current().params.date;
  date = moment(date).format("YYYY-MM-DD");
  return date;
}

component.state.startTime = function() {
  var date = Router.current().params.date;
  var time = moment(date).set("hours", 7).format("hh:mm");
  return time;
}

component.state.endTime = function() {
  var date = Router.current().params.date;
  var time = moment(date).set("hours", 5).format("hh:mm");
  return time;
}