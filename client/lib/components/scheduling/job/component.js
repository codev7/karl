var component = FlowComponents.define("schedulingJob", function(props) {
  this.job = props.job;
});

component.state.name = function() {
  if(this.job) {
    return this.job.name;
  }
}

component.state.id = function() {
  if(this.job) {
    return this.job._id;
  }
}

component.state.status = function() {
  if(this.job) {
    return this.job.status;
  }
}

component.state.timeRelHeight = function() {
  if(this.job) {
    return this.job.activeTime/2;
  }
}

component.state.setStatusPermission = function() {
  var permitted = true;
  if(this.job) {
    if(this.job.status == "draft") {
      permitted = false;
    }
  }
  return permitted;
}