var component = FlowComponents.define('itemListed', function(props) {
  this.type = props.type;
  this.item = props.item;
  // this.jobitem = props.jobitem;
  // var item = getPrepItem(this.jobitem._id);
  // this.jobitem = item;
});

component.state.name = function() {
  if(this.type == "prep") {
    return this.item.name;
  } else {
    return this.item.description;
  }
}

component.state.id = function() {
  return this.item._id;
}

component.state.type = function() {
  return this.type;
}

component.state.isTypePrep = function() {
  if(this.type == "prep") {
    return true;
  } else {
    return false;
  }
}

component.state.activeTime = function() {
  if(this.type == "prep") {
    return (this.item.activeTime/60);
  }
}

component.state.costPerPortion = function() {
  return this.jobitem.prepCostPerPortion;
}