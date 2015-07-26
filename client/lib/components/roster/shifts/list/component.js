var component = FlowComponents.define("schedulingShiftsList", function(props) {});

component.state.shiftsList = function() {
  var list = Shifts.find();
  return list;
}

component.state.shiftsCount = function() {
  var date = Session.get("thisDate");
  date = new Date(date).getTime();
  var count = Shifts.find({"shiftDate": date}).count();
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}