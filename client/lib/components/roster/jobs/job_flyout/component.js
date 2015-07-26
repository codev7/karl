var component = FlowComponents.define("jobFlyout", function(props) {
});

component.state.job = function() {
  var id = Session.get("thisJob");
  this.set("id", id);
  var job = Jobs.findOne(id);
  if(job) {
    if(job.section) {
      var section = Sections.findOne(job.section);
      if(section) {
        job.sectionName = section.name;
      } else {
        job.sectionName = "Not assigned";
      }
    }
    this.set("job", job);
    return job;
  }
}

component.state.isPrep = function() {
  var job = this.get("job");
  if(job && job.type == "Prep") {
    return true;
  } else {
    return false;
  }
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

component.state.repeatAt = function() {
  var job = this.get("job");
  if(job) {
    return moment(job.repeatAt).format("hh:mm A");
  }
}

component.state.startsOn = function() {
  var job = this.get("job");
  if(job) {
    return moment(job.startsOn).format("YYYY-MM-DD");
  }
}


component.state.instructions = function() {
  var job = this.get("job");
  if(job) {
    var item = JobItems.findOne(job.ref);
    if(item) {
      if(item.type == "Prep") {
        return item.recipe;
      } else if(item.type == "Recurring") {
        return item.description;
      }
    }
  }
}

component.state.checklist = function() {
  var job = this.get("job");
  if(job) {
    var item = JobItems.findOne(job.ref);
    if(item && item.checklist) {
      if(item.checklist.length > 0) {
        return item.checklist;
      }
    }
  }
}