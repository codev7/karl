var component = FlowComponents.define('jobItemListed', function(props) {
  this.jobitem = props.jobitem;
  var item = getPrepItem(this.jobitem._id);
  this.jobitem = item;
});

component.state.name = function() {
  return this.jobitem.name;
}

component.state.id = function() {
  return this.jobitem._id;
}

component.state.type = function() {
  return this.jobitem.type;
}

component.state.activeTime = function() {
  return this.jobitem.activeTime;
}

component.state.costPerPortion = function() {
  return this.jobitem.prepCostPerPortion;
}