var component = FlowComponents.define("submitShift", function(props) {});

component.state.today = function() {
  var today = moment().format("YYYY-MM-DD");
  return today;
}