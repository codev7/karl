var component = FlowComponents.define('submitJobItem', function(props) {
});

component.state.initialHTML = function() {
  var type = Session.get("jobType");
  if(type == "Prep") {
    return "Add recipe here";
  } else {
    return "Add description here";
  }
};

component.state.repeatAt = function() {
  return "8:00 AM";
}

component.state.week = function() {
  var week = [
    {"id": 1, "day": "Mon"},
    {"id": 2, "day": "Tue"},
    {"id": 3, "day": "Wed"},
    {"id": 4, "day": "Thurs"},
    {"id": 5, "day": "Fri"},
    {"id": 6, "day": "Sat"},
    {"id": 7, "day": "Sun"},
  ]
  return week;
}

component.action.submit = function(info) {
  Meteor.call("createJobItem", info, function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      Session.set("selectedIngredients", null);
      Session.set("selectedJobItems", null);
      Router.go("jobItemDetailed", {"_id": id});
    }
  });
};