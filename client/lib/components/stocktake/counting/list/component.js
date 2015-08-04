var component = FlowComponents.define("stockCounting", function(props) {
  this.date = Session.get("thisDate");
});

component.state.list = function() {
  var gareaId = Session.get("activeGArea");
  var sareaId = Session.get("activeSArea");
  var list = SpecialAreas.findOne({"_id": sareaId, "generalArea": gareaId});
  if(list) {
    if(list.stocks && list.stocks.length > 0) {
      subs.subscribe("ingredients", list.stocks);
    }
    return list;
  }
}

component.state.date = function() {
  return this.date;
}

component.state.filtered = function() {
  return Session.get("activeSArea");
}