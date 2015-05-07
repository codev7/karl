var component = FlowComponents.define("jobListed", function(props) {
  this.job = props.job;
});

component.state.name = function() {
  return this.job.name;
}

component.state.type = function() {
  return this.job.type;
}

component.state.status = function() {
  return this.job.status;
}

component.state.id = function() {
  return this.job._id;
}

component.state.activeTime = function() {
  var time = parseInt(this.job.activeTime);
  var timeInHours = parseInt(time/(60*60));
  var timeInMins = parseInt((time - (timeInHours*60*60))/60);
  var timeString = timeInHours + " hours "; 
  if(timeInMins > 0) {
    timeString += timeInMins + " mins";
  }
  return timeString;
}

component.state.createdOn = function() {
  return this.job.createdOn;
}

component.state.shelfLife = function() {
  return this.job.shelfLife;
}

component.state.portions = function() {
  return this.job.portions;
}