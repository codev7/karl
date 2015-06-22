var component = FlowComponents.define("shiftBasic", function(props) {
  this.shift = props.shift;
  this.onRendered(this.itemRendered);
});

component.state.shift = function() {
  return this.shift;
}

component.state.assignedTo = function() {
  var worker = this.shift.assignedTo;
  return Meteor.users.findOne(worker);
}

component.prototype.itemRendered = function() {
  var alreadtAssigned = [];
  var shifts = TemplateShifts.find({"shiftDate": this.shift.shiftDate, "assignedTo": {$exists: true}});
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
      var shift = TemplateShifts.findOne(shiftId);
      if(shift) {
        var obj = {"_id": shiftId, "assignedTo": newValue}
        editShift(obj);
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
      var shift = TemplateShifts.findOne(shiftId);
      if(shift) {
        var obj = {"_id": shiftId, "section": newValue}
        editShift(obj);
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
      var shift = TemplateShifts.findOne(shiftId);
      if(shift) {
        var obj = {"_id": shiftId, "startTime": new Date(newValue._d).getTime()}
        editShift(obj);
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
      var shift = TemplateShifts.findOne(shiftId);
      if(shift) {
        var obj = {"_id": shiftId, "endTime": new Date(newValue._d).getTime()};
        editShift(obj);
      }
    }
  });
}

function editShift(obj) {
  Meteor.call("editTemplateShift", obj, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}