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

component.state.assignedWorker = function() {
  if(this.shift) {
    var user = Meteor.users.findOne(this.shift.assignedTo);
    if(user) {
      return user.username;
    }
  }
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

component.state.workers = function() {
  var assigned = [];
  assigned.push(this.shift.assignedTo);
  var workers = null;
  if(assigned) {
    workers = Meteor.users.find({"_id": {$nin: assigned}, "isWorker": true});
  } else {
    workers = Meteor.users.find({"isWorker": true});
  }
  return workers;
}

component.state.timeLine = function() {
  var line = [];
  for(var i=1; i<=24; i++) {
    line.push(i + ":00");
  }
  return line;
}