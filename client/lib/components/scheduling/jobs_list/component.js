var component = FlowComponents.define("schedulingJobsList", function(props) {});

component.state.jobsList = function() {
  var list = Jobs.find({"onshift": null});
  return list;
}