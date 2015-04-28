var component = FlowComponents.define("schedulingShift", function(props) {
  this.shift = props.shift;
  console.log(this.shift);
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