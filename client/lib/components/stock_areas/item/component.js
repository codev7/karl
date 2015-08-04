var component = FlowComponents.define("areaItem", function(props) {
  this.item = props.item;
});

component.state.area = function() {
  return this.item;
}

component.state.specialAreas = function() {
  var id = this.item._id;
  return SpecialAreas.find({"generalArea": id}, {"sort": {"name": 1}});
}