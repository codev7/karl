var component = FlowComponents.define("shiftItem", function(props) {
  this.shift = props.shift;
});

component.state.shift = function() {
  if(this.shift) {
    return this.shift;
  }
}

component.state.section = function() {
  if(this.shift) {
    if(this.shift.section) {
      var section = Sections.findOne(this.shift.section);
      if(section) {
        return section.name;
      } 
    } else {
      return "Open";
    }
  }
}

component.state.hasClaimed = function() {
  var shift = this.shift;
  if(shift && shift.claimedBy) {
    if(shift.claimedBy.indexOf(Meteor.userId()) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.hadBeenRejected = function() {
  var shift = this.shift;
  if(shift && shift.rejectedFor) {
    if(shift.rejectedFor.indexOf(Meteor.userId()) >= 0) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.confirmed = function() {
  if(this.shift && this.shift.confirmed) {
    return "success";
  }
}

component.state.isPermitted = function() {
  if(this.shift && this.shift.shiftDate) {
    if(this.shift.shiftDate < new Date().getTime()) {
      return false;
    } else {
      return true;
    }
  }
}

component.state.timeRecorded = function() {
  if(this.shift && this.shift.shiftDate) {
    if(this.shift.shiftDate < new Date().getTime()) {
     if(this.shift.startedAt && this.shift.finishedAt) {
        return this.shift.finishedAt - this.shift.startedAt; 
      }
    }
  }
}

component.state.activeShift = function() {
  var shift = this.shift;
  if(shift && shift.status == "started") {
    return true;
  } else {
    return false;
  }
}

component.state.open = function() {
  var state = Session.get("shiftState");
  if(state == "open") {
    return true;
  } else {
    return false;
  }
}

component.state.past = function() {
  var state = Session.get("shiftState");
  if(state == "past") {
    return true;
  } else {
    return false;
  }
}