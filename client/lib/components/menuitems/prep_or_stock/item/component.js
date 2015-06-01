var component = FlowComponents.define("ingsAndPreps", function(props) {
  this.type = props.type;
  if(this.type == "prep") {
    this.item = JobItems.findOne(props.item._id);
    this.quantity = props.item.quantity;
  } else if(this.type == "ings") {
    this.item = Ingredients.findOne(props.item._id);
    this.quantity = props.item.quantity;
  }
});

component.state.name = function() {
  if(this.item) {
    if(this.type == "prep") {
      return this.item.name;
    } else if(this.type == "ings") {
      return this.item.description;
    }
  }
}

component.state.quantity = function() {
  if(this.item) {
    return this.quantity;
  }
}

component.state.id = function() {
  if(this.item) {
    return this.item._id;
  }
}

component.state.type = function() {
  return this.type;
}

component.state.measure = function() {
  if(this.item) {
    if(this.type == "prep") {
      return this.item.measure;
    } else if(this.type == "ings") {
      return this.item.portionUsed;
    }
  }
}