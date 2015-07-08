var component = FlowComponents.define('jobItemEdit', function(props) {
  this.jobitem = props.jobitem;
  var item = getPrepItem(this.jobitem._id);
  this.jobitem = item;
  this.jobitem.quantity = props.jobitem.quantity;
});

component.state.item = function() {
  return this.jobitem;
}

component.state.quantity = function() {
  if(this.jobitem.quantity) {
    return this.jobitem.quantity;
  } else {
    return 1;
  }
}