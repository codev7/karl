var subs = new SubsManager();

var component = FlowComponents.define('jobItemListed', function(props) {
  this.jobitem = props.jobitem;
  subs.subscribe("jobItems", [this.jobitem._id]);
});

component.state.item = function() {
  return this.jobitem;
}

component.state.costPerPortion = function() {  
  if(this.jobitem) {
    var item = getPrepItem(this.jobitem._id);
    if(item) {
      return item.prepCostPerPortion;
    }
  }
}