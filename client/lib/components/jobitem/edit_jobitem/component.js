var component = FlowComponents.define('editJobItem', function(props) {
  var id = Router.current().params._id;
  if(id) {
    var item = JobItems.findOne(id);
    if(item) {
      this.item = item;
    }
  }
});

component.state.initialHTML = function() {
  var id = Session.get("thisJobItem");
  var item = JobItems.findOne(id);
  if(item) {
    if(item.recipe) {
      return item.recipe;
    } else {
      return "Add recipe here";
    }
  }
};

component.state.id = function() {
  return this.item._id;
}

component.state.name = function() {
  return this.item.name;
}

component.state.ingredients = function() {
  return this.item.ingredients;
}

component.state.type = function() {
  return this.item.type;
}

component.state.activeTime = function() {
  return this.item.activeTime;
}

component.state.portions = function() {
  return this.item.portions;
}

component.state.shelfLife = function() {
  return this.item.shelfLife;
}

component.state.wagePerHour = function() {
  return this.item.wagePerHour;
}

component.state.isMyType = function(type) {
  var myType = this.item.type;
  if(myType === type) {
    return true;
  } else {
    return false;
  }
}

component.action.submit = function(id, info) {
  Meteor.call("editJobItem", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Router.go("jobItemDetailed", {"_id": id});
    }
  });
};