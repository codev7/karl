var component = FlowComponents.define("jobProfile", function(props) {

});

component.state.id = function() {
  var id = Session.get("thisJob");
  this.set("id", id);
  return id;
}

component.state.name = function() {
  var id = this.get("id");
  var job = Jobs.findOne(id);
  if(job) {
    this.set("job", job);
    return job.name;
  }
}

component.state.type = function() {
  var job = this.get("job");
  if(job) {
    return job.type;
  }
}

component.state.activeTime = function() {
  var job = this.get("job");
  if(job) {
    var activeTime = job.activeTime;
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

component.state.portions = function() {
  var job = this.get("job");
  if(job) {
    return job.portions;
  }
}

component.state.status = function() {
  var job = this.get("job");
  if(job) {
    return job.status;
  }
}

