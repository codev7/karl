var component = FlowComponents.define("dailyShiftScheduling", function(props) { 
});

component.state.date = function() {
  var date = Router.current().params.date;
  return moment(date).format("YYYY-MM-DD");
}