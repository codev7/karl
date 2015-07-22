var component = FlowComponents.define("rosteredShiftItem", function(props) {
  this.set("shift", props.shift);
});

component.state.item = function() {
  return this.get("shift");
}

component.state.section = function() {
  var shift = this.get("shift");
  if(shift && shift.section) {
    console.log("shift..", shift);
    var section = Sections.findOne(shift.section);
    console.log("..........", section)
    if(section) {
      return section.name;
    }
  }
}