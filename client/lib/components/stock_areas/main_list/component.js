var component = FlowComponents.define("stockAreas", function() {});

component.state.areas = function() {
  var data = GeneralAreas.find({}, {sort: {"name": 1}});
  return data;
}