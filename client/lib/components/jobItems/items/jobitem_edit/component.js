var component = FlowComponents.define('jobItemEdit', function(props) {
  this.jobitem = props.jobitem;
  var item = getPrepItem(this.jobitem._id);
  this.jobitem = item;
  this.jobitem.quantity = props.jobitem.quantity;
});

component.state.id = function() {
  return this.jobitem._id;
}

component.state.name = function() {
  return this.jobitem.name;
}

component.state.type = function() {
  return this.jobitem.type;
}

component.state.costPerPortion = function() {
  return this.jobitem.prepCostPerPortion;
}

component.state.quantity = function() {
  return this.jobitem.quantity;
}