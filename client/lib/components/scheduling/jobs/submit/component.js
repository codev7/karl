var component = FlowComponents.define("submitJob", function(props) {
  this.onRendered(this.onJobRendered);
});

component.state.jobTypes = function() {
  return ["Prep", "Recurring"];
}

component.state.jobs = function() {
  return JobItems.find({"type": this.get("type")});
}

component.action.onChangeType = function(type) {
  this.set("type", type);
}

component.action.onChangeJob = function(job) {
  this.set("jobRef", job);
}

component.action.keyup = function(portions) {
  var jobId = this.get("jobRef");
  if(jobId) {
    var job = JobItems.findOne(jobId);
    if(job) {
      var time = (job.activeTime/job.portions) * portions;
      this.set("activeTime", time);
    }
  }
}

component.state.isPrep = function() {
  if(this.get('type') == "Prep") {
    return true;
  } else {
    return false;
  }
}

component.state.activeTimes = function() {
  if(this.get('type') == "Prep") {
    var miliSeconds = parseInt(this.get("activeTime")) * 1000;
    var hours = moment.duration(miliSeconds).hours();
    var minutes = moment.duration(miliSeconds).minutes();
    var seconds = moment.duration(miliSeconds).seconds();
    var text = "";
    if(hours > 0) {
      text = hours + " hours ";
    }
    if(minutes > 0) {
      text += minutes + " minutes ";
    }
    if(seconds > 0) {
      text += seconds + " seconds";
    }
    return text;
  }
}

component.prototype.onJobRendered = function() {
  this.set("type", "Prep");
  this.set("activeTime", 0);
}

component.action.submit = function(info) {
  var self = this;
  Meteor.call("createNewJob", info, function(err, id) {
    if(err) {
      return alert(err.reason);
    } else {
      self.set("type", "Prep");
      $("input").val(0);
      $('select').prop('selectedIndex', 0);
      self.set("activeTime", 0);
      $("#submitJobModal").modal("hide");
    }
  });
}