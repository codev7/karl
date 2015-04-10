var subs = new SubsManager();

var component = FlowComponents.define("salesList", function(props) {
  this.set("view", props.list);
  if(props.list == "listOnRange") {
    this.renderedListOnRange();
  } else {
    subs.subscribe("salesOnDate", props.date);
    this.set("date", props.date);
  }
});

component.state.salesMenusList = function() {
  var sales = null;
  if(this.get("date")) {
    sales = Sales.find({"date": this.get("date")}).fetch();
  } else {
    sales = this.get("list")
  }
  return sales;
}

component.state.isRanged = function() {
  if(this.get("view") == "listOnRange") {
    return true;
  } else {
    return false;
  }
}

component.prototype.renderedListOnRange = function() {
  var self = this;
  Meteor.call("getRangedData",  parseInt(Session.get("daysRangeCount")), function(err, doc) {
    if(err) {
      console.log(err);
    } else {
      self.set("list", doc);
    }
  });
}