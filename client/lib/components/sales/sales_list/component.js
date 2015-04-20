var subs = new SubsManager();

var component = FlowComponents.define("salesList", function(props) {
  this.set("view", props.list);
  this.set("name", props.name);
  if(props.name == "actualSales") {
    subs.subscribe("salesOnDate", new Date(props.date));
    this.set("date", props.date);
  }
});

component.state.salesMenusList = function() {
  var sales = null;
  if(this.get("name") == "actualSales") {
    var date = this.get("date");
    if(date) {
      sales = Sales.find({"date": new Date(date)});
    } 
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
      return alert(err.reason);
    } else {
      self.set("list", doc);
    }
  });
}

component.state.totalItemCount = function() {
  var total = 0;
  var sales = Sales.find({"date": new Date(this.get("date"))}).fetch();
  sales.forEach(function(doc) {
    total += doc.quantity;
  });
  return total;
}

component.state.totalRevenue = function() {
  var total = 0;
  var sales = Sales.find({"date": new Date(this.get("date"))}).fetch();
  sales.forEach(function(doc) {
    var revenue = doc.quantity * doc.soldAtPrice;
    total += revenue;
  });
  return total;
}