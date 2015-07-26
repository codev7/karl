var component = FlowComponents.define("shiftProfile", function(props) {
});

component.state.date = function() {
  var id = this.get("id");
  var shift = Shifts.findOne(id);
  if(shift) {
    this.set("shift", shift);
    return moment(shift.shiftDate).format("YYYY-MM-DD");
  }
}

component.state.id = function() {
  var id = Session.get("thisShift");
  this.set("id", id);
  return id;
}

component.state.startTime = function() {
  var shift = this.get("shift");
  if(shift) {
    return moment(shift.startTime).format("h:mm A");
  }
}

component.state.mySection = function() {
  var shift = this.get("shift");
  if(shift && shift.section) {
    var section = Sections.findOne(shift.section);
    if(section) {
      return section;
    }
  } 
}

component.state.endTime = function() {
  var shift = this.get("shift");
  if(shift) {
    return moment(shift.endTime).format("h:mm A");
  }
}

component.state.sections = function() {
  var shift = this.get("shift");
  if(shift) {
    var section = shift.section;
    if(section) {
      return Sections.find({"_id": {$nin: [section]}});
    } else {
      return Sections.find();
    }
  }
}

component.action.submit = function(info) {
  var self = this;
  var id = self.get("id");
  Meteor.call("editShift", id, info, function(err, id) {
    if(err) {
      return alert(err.reason);
    } else {
      var shift = Shifts.findOne(id);
      self.set("shift", shift)
      $("#shiftProfile").modal("hide");
    }
  });
}