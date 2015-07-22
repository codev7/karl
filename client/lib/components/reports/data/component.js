var component = FlowComponents.define("reportData", function(props) {
  this.shift = props;
});

component.state.shift = function() {
  if(this.shift && this.shift.shift && this.shift.shift.shift) {
    var shiftId = this.shift.shift.shift;
    var shift = Shifts.findOne(shiftId);
    if(shift && shift.shiftDate <= new Date().getTime()) {
      return shift;
    } else {
      return null;
    }
  }
}

component.state.currentShift = function() {
  if(this.shift && this.shift.shift && this.shift.shift.shift) {
    var shiftId = this.shift.shift.shift;
    var shift = Shifts.findOne(shiftId);
    var today = moment().format("YYYY-MM-DD");
    if(shift && shift.shiftDate == new Date(today).getTime()) {
      return true;
    } else {
      return false;
    }
  }
}