var component = FlowComponents.define("sections", function(props) {});

component.state.sections = function() {
  return Sections.find();
}