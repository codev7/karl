var component = FlowComponents.define("stockTakeMasterList", function() {
  this.onRendered(this.onListRender);
});

component.state.listOfDates = function() {
  var list = this.get("historyList");
  if(list) {
    return list;
  }
}

component.prototype.onListRender = function() {
  var self = this;
  Meteor.call("stockTakeHistory", function(err, list) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      self.set("historyList", list);
    }
  });
}