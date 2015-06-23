var component = FlowComponents.define("shiftBasic", function(props) {
  this.shift = props.shift;
  origin = props.origin;
  this.set("origin", origin);
  this.onRendered(this.itemRendered);
});

component.state.shift = function() {
  return this.shift;
}

component.state.assignedTo = function() {
  var worker = this.shift.assignedTo;
  return Meteor.users.findOne(worker);
}

component.action.deleteShift = function(id) {
  var origin = this.get("origin");
  if(origin == "weeklyrostertemplate") {
    Meteor.call("deleteTemplateShift", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  } else if(origin == "weeklyroster") {
    Meteor.call("deleteShift", id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
}

component.prototype.itemRendered = function() {
  var alreadtAssigned = [];
  var origin = this.get("origin");
  var shifts = null;
  if(origin == "weeklyrostertemplate") {
    shifts = TemplateShifts.find({"shiftDate": this.shift.shiftDate, "assignedTo": {$exists: true}}).fetch();
  } else if(origin == "weeklyroster") {
    shifts = Shifts.find({"shiftDate": this.shift.shiftDate}).fetch();
  }
  shifts.forEach(function(shift) {
    if(shift.assignedTo) {
      alreadtAssigned.push(shift.assignedTo);
    }
  });
  var workers = Meteor.users.find({"_id": {$nin: alreadtAssigned}, "isActive": true, $or: [{"isWorker": true}, {"isManager": true}]}).fetch();
  var workersObj = []
  workers.forEach(function(worker) {
    workersObj.push({value: worker._id, text: worker.username});
  });

  $('.select-worker').editable({
    value: 2,    
    source: workersObj,
    title: 'Select worker to assign',
    success: function(response, newValue) {
      var shiftId = $(this).closest("li").attr("data-id");
      var obj = {"_id": shiftId, "assignedTo": newValue}
      var shift = null;
      if(origin == "weeklyrostertemplate") {
        shift = TemplateShifts.findOne(shiftId);
        if(shift) {
          editTemplateShift(obj);
        }
      } else if(origin == "weeklyroster") {
        shift = Shifts.findOne(shiftId);
        if(shift) {
          editShift(obj);
        }
      }
    }
  });

  var sections = Sections.find().fetch();
  var sectionsObj = [];
  sections.forEach(function(section) {
    sectionsObj.push({"value": section.name, "text": section.name});
  });
  $('.section').editable({
    value: 2,    
    source: sectionsObj,
    title: "Select section to assign",
    success: function(response, newValue) {
      var shiftId = $(this).closest("li").attr("data-id");
      var obj = {"_id": shiftId, "section": newValue}
      var shift = null;
      if(origin == "weeklyrostertemplate") {
        shift = TemplateShifts.findOne(shiftId);
        if(shift) {
          editTemplateShift(obj);
        }
      } else if(origin == "weeklyroster") {
        shift = Shifts.findOne(shiftId);
        if(shift) {
          editShift(obj);
        }
      }
    }
  });

  $(".shiftStartTime").editable({
    type: 'combodate',
    title: 'Select start time',
    template: "HH:mm",
    viewformat: "HH:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    display: false,
    showbuttons: true,
    success: function(response, newValue) {
      var shiftId = $(this).closest("li").attr("data-id");
      var obj = {"_id": shiftId, "startTime": new Date(newValue._d).getTime()}
      var shift = null;
      if(origin == "weeklyrostertemplate") {
        shift = TemplateShifts.findOne(shiftId);
        if(shift) {
          editTemplateShift(obj);
        }
      } else if(origin == "weeklyroster") {
        shift = Shifts.findOne(shiftId);
        if(shift) {
          editShift(obj);
        }
      }
    }
  });

  $(".shiftEndTime").editable({
    type: 'combodate',
    title: 'Select end time',
    template: "HH:mm",
    viewformat: "HH:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    display: false,
    showbuttons: true,
    success: function(response, newValue) {
      var shiftId = $(this).closest("li").attr("data-id");
      var obj = {"_id": shiftId, "endTime": new Date(newValue._d).getTime()};
      var shift = null;
      if(origin == "weeklyrostertemplate") {
        shift = TemplateShifts.findOne(shiftId);
        if(shift) {
          editTemplateShift(obj);
        }
      } else if(origin == "weeklyroster") {
        shift = Shifts.findOne(shiftId);
        if(shift) {
          editShift(obj);
        }
      }
    }
  });
}

function editTemplateShift(obj) {
  Meteor.call("editTemplateShift", obj, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}

function editShift(obj) {
  Meteor.call("editShift", obj, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}