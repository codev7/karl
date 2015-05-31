var component = FlowComponents.define("ingsAndPreps", function(props) {
  this.type = props.type;
  if(this.type == "prep") {
    var item = getPrepItem(props.item._id);
    this.item = item;
    this.item.quantity = props.item.quantity;
  } else if(this.type == "ings") {
    var item = getIngredientItem(props.item._id);
    this.item = item;
    this.item.quantity = props.item.quantity;
  }
});

component.state.name = function() {
  if(this.item) {
    if(this.type == "prep") {
      return this.item.name;
    } else if(this.type == "ings") {
      return this.item.code;
    }
  }
}

component.state.quantity = function() {
  if(this.item) {
    return this.item.quantity;
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