var component = FlowComponents.define('jobItemView', function(props) {
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

component.state.quantity = function() {
  return this.jobitem.quantity;
}

component.state.cost = function() {
  var cost = this.jobitem.prepCostPerPortion * this.jobitem.quantity;
  cost = Math.round(cost * 100)/100;
  return cost;
}