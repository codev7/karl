var component = FlowComponents.define("schedulingShiftsList", function(props) {});

component.state.shiftsList = function() {
  var list = Shifts.find();
  return list;
}

component.state.shiftsCount = function() {
  var count = Shifts.find().count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}