var component = FlowComponents.define("showListOfIngs", function(props) {});

component.state.getJobItems = function(argument) {
  return JobItems.find({}, {"limit": 10});
}

component.state.getIngItems = function(argument) {
  return Ingredients.find({}, {"limit": 10});
}