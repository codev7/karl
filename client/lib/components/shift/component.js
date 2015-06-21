var component = FlowComponents.define("shiftItem", function(props) {
  this.shift = props.shift;
});

component.state.shift = function() {
  if(this.shift) {
    return this.shift;
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