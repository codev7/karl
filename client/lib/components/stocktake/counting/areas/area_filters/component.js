var component = FlowComponents.define("areaFilters", function(props) {});

component.state.generalAreas = function() {
  var data = GeneralAreas.find({}, {sort: {"createdAt": 1}});
  return data;
}

component.state.specialAreas = function() {
  var id = Session.get("activeGArea");
  if(id) {
    return SpecialAreas.find({"generalArea": id}, {sort: {"createdAt": 1}});  
  }
}
