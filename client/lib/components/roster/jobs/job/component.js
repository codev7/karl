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
    var time = this.job.activeTime/60;
    return time * 0.68 + "px";
  }
}

component.state.activeTime = function() {
  if(this.job) {
    var activeTime = this.job.activeTime;
    var hours = parseInt(activeTime/(60*60));
    var timeString = null;
    if(hours > 0) {
      timeString = hours + " hours ";
    }
    var mins = parseInt((activeTime - (hours*60*60))/60);
    if(mins > 0) {
      if(timeString) {
        timeString += mins + " mins";
      } else {
        timeString = mins + " mins";
      }
    }
    return timeString;
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