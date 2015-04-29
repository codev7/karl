var component = FlowComponents.define("schedulingShift", function(props) {
  this.shift = props.shift;
});

component.state.name = function() {
  var name = null;
  if(this.shift) {
    var startTime = this.shift.startTime;
    var endTime = this.shift.endTime;
    startTime = moment(startTime).format("hh:mm A");
    endTime = moment(endTime).format("hh:mm A");
    name = startTime + " - " + endTime + " Shift";
  }
  return name;
}

component.state.id = function() {
  if(this.shift) {
    return this.shift._id;
  }
}

component.state.jobs = function() {
  if(this.shift) {
    if(this.shift.jobs.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.jobsList = function() {
  if(this.shift) {
    var jobs = Jobs.find({"_id": {$in: this.shift.jobs}});
    return jobs;
  }
}