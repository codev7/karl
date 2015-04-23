var subs = new SubsManager();

var component = FlowComponents.define("cafeForecastItemForDay", function(props) {
  this.day = props.day;
  subs.subscribe("allCategories");
});

component.state.day = function() {
  return this.day;
}

component.state.categories = function() {
  return Categories.find();
}