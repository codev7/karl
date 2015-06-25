var component = FlowComponents.define("weeklyShiftRoster", function(props) {
  this.name = props.name;
  this.onRendered(this.onListRendered);

});

component.state.week = function() {
  if(this.name == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    return week;
  } else if(this.name == "weeklyrostertemplate") {
    var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return daysOfWeek;
  }
}

component.state.origin = function() {
  return this.name;
}

component.prototype.onListRendered = function() {
  var origin = this.name;
  $(".sortable-list").sortable({
    "connectWith": ".sortable-list",
    "revert": true
  });


  $(".sortable-list").on("sortreceive", function(event, ui) {
    var self = this;
    var id = $(ui.item[0]).attr("data-id");//shiftid
    var  newDate = $(this).attr("data-date")//date of moved list
    if(origin == "weeklyrostertemplate") {
      var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      newDate = parseInt(daysOfWeek.indexOf(newDate));
    }
    if(id && newDate) {
      if(origin == "weeklyroster") {
        Meteor.call("editShift", {"_id": id, "shiftDate": newDate}, function(err) {
          if(err) {
            console.log(err);
            $(ui.sender[0]).sortable('cancel');;
            return alert(err.reason);
          }
        });
      } else if(origin == "weeklyrostertemplate") {
        Meteor.call("editTemplateShift", {"_id": id, "shiftDate": newDate}, function(err) {
          if(err) {
            console.log(err);
            $(ui.sender[0]).sortable('cancel');;
            return alert(err.reason);
          }
        });
      }
    }
  });
}