var component = FlowComponents.define("shiftBasic", function(props) {
  this.shift = props.shift;
  origin = props.origin;
  this.set("origin", origin);
  this.onRendered(this.itemRendered);
});

component.state.shift = function() {
  return this.shift;
}

component.state.thisorigin = function() {
  return this.get("origin");
}

component.state.section = function() {
  if(this.shift && this.shift.section) {
    return Sections.findOne(this.shift.section);
  } 
}

component.state.assignedTo = function() {
  var worker = this.shift.assignedTo;
  if(worker) {
    return Meteor.users.findOne(worker);
  } 
}

component.state.isUserPermitted = function() {
  var user = Meteor.user();
  var permitted = true;
  if(user.isAdmin || user.isManager) {
    permitted = true;
  } else {
    permitted = false;
  }
  return permitted;
}

component.action.deleteShift = function(id) {
  Meteor.call("deleteShift", id, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    }
  });
}

component.prototype.itemRendered = function() {
  $.fn.editable.defaults.mode = 'inline';
  var origin = this.get("origin");
  setTimeout(function() {
    $('.select-worker').editable({
      type: "select",
      title: 'Select worker to assign',
      inputclass: "editableWidth",
      showbuttons: false,
      emptytext: 'Open',
      defaultValue: "Open",
      source: function() {
        var shiftId = $(this).closest("li").attr("data-id");
        var thisShift = Shifts.findOne(shiftId);

        var alreadyAssigned = [];
        var workersObj = []
        var shifts = null;
        var query = {
          "shiftDate": thisShift.shiftDate
        }
        if(origin == "weeklyrostertemplate") {
          query['type'] = "template";
        } else if(origin == "weeklyroster") {
          query['type'] = null;
        }
        shifts = Shifts.find(query).fetch();

        shifts.forEach(function(shift) {
          if(shift.assignedTo) {
            alreadyAssigned.push(shift.assignedTo);
          }
        });

        var index = alreadyAssigned.indexOf(thisShift.assignedTo);
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
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          assignWorkerToShift(newValue, shiftId, $(this));
        }
        if(origin == "weeklyroster") {
          if(shift.assignedTo && shift.published) {
            //notify old user
            var title =  "Update on shift dated " + moment(shift.shiftDate).format("YYYY-MM-DD");
            var text = "You have been removed from this assigned shift";
            sendNotification(shiftId, shift.assignedTo, title, text);
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
          sectionsObj.push({"value": section._id, "text": section.name});
        });
        return sectionsObj;
      },
      success: function(response, newValue) {
        if(newValue == "Open") {
          newValue = null;
        }
        var shiftId = $(this).closest("li").attr("data-id");
        var obj = {"_id": shiftId, "section": newValue}
        var shift = Shifts.findOne(shiftId);
        if(shift) {
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
      display: false,
      showbuttons: true,
      inputclass: "editableTime",
      mode: 'inline',
      success: function(response, newValue) {
        var shiftId = $(this).closest("li").attr("data-id");
        var obj = {"_id": shiftId}
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          if(origin == "weeklyrostertemplate") {
            obj.startTime = new Date(newValue).getTime();
          } else if(origin == "weeklyroster") {
            var startHour = moment(newValue).hour();
            var startMin = moment(newValue).minute();
            obj.startTime = new Date(moment(shift.shiftDate).set('hour', startHour).set("minute", startMin));
          }
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
      inputclass: "editableTime",
      mode: 'inline',
      success: function(response, newValue) {
        var shiftId = $(this).closest("li").attr("data-id");
        var obj = {"_id": shiftId};
        var shift = Shifts.findOne(shiftId);
        if(shift) {
          if(origin == "weeklyrostertemplate") {
            obj.endTime = new Date(newValue).getTime();
          } else if(origin == "weeklyroster") {
            var endHour = moment(newValue).hour();
            var endMin = moment(newValue).minute();
            obj.endTime = new Date(moment(shift.shiftDate).set('hour', endHour).set("minute", endMin));
          }
          editShift(obj);
        }
      }
    });  
  }, 500);
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

assignWorkerToShift = function(worker, shiftId, target) {
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