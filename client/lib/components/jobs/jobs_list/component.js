var component = FlowComponents.define("jobsList", function(props) {});

component.state.jobsList = function() {
  var jobs = Jobs.find({"onshift": null, "status": "draft"});
  return jobs;
}