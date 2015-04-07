var component = FlowComponents.define('homeCountTags', function(props) {
  this.ingCountMethod();
  this.jobItemsCountMethod();
  this.menuItemsCountMethod();
});

component.prototype.ingCountMethod = function() {
  var self = this;
  Meteor.call("ingredientsCount", function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("ingCount", result)
    }
  });
}

component.state.ingredientCount = function() {
  return this.get("ingCount")
}

component.prototype.jobItemsCountMethod = function() {
  var self = this;
  Meteor.call("jobItemsCount", function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("jobsCount", result)
    }
  });
  
}

component.state.jobItemsCount = function() {
  return this.get("jobsCount")
}

component.prototype.menuItemsCountMethod = function() {
  var self = this;
  Meteor.call("menuItemsCount", function(err, result) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("menusCount", result);
    }
  });
}

component.state.menuItemsCount = function() {
  return this.get("menusCount");
}