var component = FlowComponents.define('jobItemDetailed', function(props) {
  this.jobitem = props.jobitem;
  var item = getPrepItem(this.jobitem._id);
  this.jobitem = item;
});

component.state.id = function() {
  return this.jobitem._id;
}

component.state.name = function() {
  return this.jobitem.name;
}

component.state.activeTime = function() {
  return this.jobitem.activeTime;
}

component.state.type = function() {
  return this.jobitem.type;
}

component.state.shelfLife = function() {
  return this.jobitem.shelfLife;
}

component.state.portions = function() {
  return this.jobitem.portions;
}

component.state.cost = function() {
  return this.jobitem.prepCostPerPortion;
}
