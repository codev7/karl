var component = FlowComponents.define("shiftBasic", function(props) {
  this.shift = props.shift;
  origin = props.origin;
  this.set("origin", origin);
  this.set("user", Meteor.user());
  this.onRendered(this.itemRendered);
});

component.state.shift = function() {
  return this.shift;
}

component.state.assignedTo = function() {
  var worker = this.shift.assignedTo;
  if(worker) {
    return Meteor.users.findOne(worker);
  }
}

component.state.isUserPermitted = function() {
  var user = Meteor.user();
  if(user.isAdmin || user.isManager) {
    return true;
  } else {
    return false;
  }
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
  $.fn.editable.defaults.mode = 'inline';

  var user = this.get("user");
  if(user) {
    var origin = this.get("origin");
    var date = this.shift.shiftDate;
    var worker = this.shift.assignedTo;

    setTimeout(function() {
      $('.select-worker').editable({
        type: "select",
        title: 'Select worker to assign',
        inputclass: "editableWidth",
        showbuttons: false,
        emptytext: 'Open',
        defaultValue: "Open",
        source: function() {
          var alreadyAssigned = [];
          var workersObj = []
          var shifts = null;
          if(origin == "weeklyrostertemplate") {
            shifts = TemplateShifts.find({"shiftDate": date, "assignedTo": {$exists: true}}).fetch();
          } else if(origin == "weeklyroster") {
            shifts = Shifts.find({"shiftDate": date}).fetch();
          }

          shifts.forEach(function(shift) {
            if(shift.assignedTo) {
              alreadyAssigned.push(shift.assignedTo);
            }
          });

          var index = alreadyAssigned.indexOf(worker);
          if(index >=0) {
            alreadyAssigned.splice(index, 1);
          }
          workersObj.push({value: "Open", text: "Open"});
          var workers = Meteor.users.find({
            "_id": {$nin: alreadyAssigned}, 
            "isActive": true, 
            $or: [{"isWorker": true}, {"isManager": true}]
          }, {sort: {"username": 1}}).fetch();
          workers.forEach(function(worker) {
            workersObj.push({value: worker._id, text: worker.username});
          });
          return workersObj;
        },
        success: function(response, newValue) {
          var shiftId = $(this).closest("li").attr("data-id");
          if(newValue == "Open") {
            newValue = null;
          }

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
              if(shift.assignedTo && shift.published) {
                //notify old user
                var title =  "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
                var text = "You have been removed from this assigned shift";
                sendNotification(shiftId, shift.assignedTo, title, text);
              }
              assignWorkerToShift(newValue, shiftId, $(this));
            }
          }
        }
      });

      $('.section').editable({
        type: "select",
        title: "Select section to assign",
        inputclass: "editableWidth",
        showbuttons: false,
        emptytext: 'Open',
        defaultValue: "Open",    
        source: function() {
          var sections = Sections.find().fetch();
          var sectionsObj = [];
          sectionsObj.push({value: "Open", text: "Open"});
          sections.forEach(function(section) {
            sectionsObj.push({"value": section.name, "text": section.name});
          });
          return sectionsObj;
        },
        success: function(response, newValue) {
          if(newValue == "Open") {
            newValue = null;
          }
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
        inputclass: "editableTime",
        mode: 'inline',
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
        inputclass: "editableTime",
        mode: 'inline',
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
    }, 500);   
  }
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
  Meteor.call("editShift", obj._id, obj, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      var shift = Shifts.findOne(obj._id);
      if(shift.published && shift.assignedTo) {
        //notify new user
        var title = "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
        var text = null;
        if(obj.hasOwnProperty("endTime")) {
          text = "Shift end time has been updated";
        }
        if(obj.hasOwnProperty("startTime")) {
          text = "Shift start time has been updated";
        }
        if(obj.hasOwnProperty("section")) {
          text = "Shift section has been updated";
        }
        sendNotification(obj._id, shift.assignedTo, title, text);
      }
    }
  });
}

function assignWorkerToShift(worker, shiftId, target) {
  var shift = Shifts.findOne(shiftId);
  if(shift) {
    Meteor.call("assignWorker", worker, shiftId, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
        $(target).editable("setValue", shift.assignedTo);
        return;
      } else {
        if(shift.published) {
          //notify new user
          var title = "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
          var text = "You have been assigned to this shift";
          sendNotification(shiftId, worker, title, text);
        }
      }
    });
  }
}

function sendNotification(itemId, to, title, text) {
  var type = "roster";
  var options = {
    "title": title,
    "type": "update",
    "text": text,
    "to": to
  }
  Meteor.call("sendNotifications", itemId, type, options, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}