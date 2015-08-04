var component = FlowComponents.define('editJobItem', function(props) {
  var id = Router.current().params._id;
  if(id) {
    var item = JobItems.findOne(id);
    if(item) {
      this.item = item;
    }
  }
});

component.state.initialHTML = function() {
  var id = Session.get("thisJobItem");
  var item = JobItems.findOne(id);
  var type = this.get("type");
  if(item) {
    if(type == "Prep") {
      if(item.recipe) {
        return item.recipe;
      } else {
        return "Add recipe here";
      } 
    } else if(type == "Recurring") {
      if(item.description) {
        return item.description;
      } else {
        return "Add description here";
      }
    } 
  }
};

component.state.isPrep = function() {
  var type = this.get("type");
  if(type) {
    if(type == "Prep") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isRecurring = function() {
  var type = this.get("type");
  if(type) {
    if(type == "Recurring") {
      return true;
    } else {
      return false;
    }
  }
}


component.state.item = function() {
  return this.item;
}

component.state.ingredients = function() {
  return this.item.ingredients;
}

component.state.jobTypes = function() {
  return JobTypes.find({"_id": {$nin: [this.item.type]}});
}

component.state.typesWithSelected = function() {
  var types = [
    {"index": "Prep", "selected": false},
    {"index": "Recurring", "selected": false}
  ];
  var type = this.item.type;
  if(Session.get("jobType")) {
    type = Session.get("jobType");
  }
  this.set("type", type);
  types.forEach(function(doc) {
    if(type == doc.index) {
      doc.selected = true;
    }
  });
  return types;
}

component.state.frequencyWithSelected = function() {
  var frequencies = [
    {"index": "Daily", "selected": false},
    {"index": "Weekly", "selected": false}
  ];
  var frequency = this.item.frequency;
  if(Session.get("frequency")) {
    frequency = Session.get("frequency");
  }
  this.set("frequency", frequency);
  frequencies.forEach(function(doc) {
    if(frequency == doc.index) {
      doc.selected = true;
    }
  });
  return frequencies;
}


component.state.isRecurringDaily = function() {
  if(this.get("frequency") == "Daily") {
    return true;
  } else {
    return false;
  }
}

component.state.checklist = function() {
  var list = this.item.checklist;
  if(list) {
    if(list.length > 0) {
      Session.set("checklist", list);
      return this.item.checklist;
    }
  }
}

component.state.repeatAt = function() {
  var at = this.item.repeatAt;
  if(!this.item.repeatAt) {
    at = "8:00 AM"
  }
  return moment(at).format("h:mm A");
}

component.state.startsOn = function() {
  if(this.item.startsOn) {
    return moment(this.item.startsOn).format("YYYY-MM-DD");
  } else {
    return moment().format("YYYY-MM-DD");
  }
}

component.state.endsOnNotNull = function() {
  if(this.item.endsOn) {
    return true;
  } else {
    return false;
  }
}

component.state.endsNever = function() {
  var item = this.item;
  if(item && item.endsOn) {
    if(item.endsOn.on == "endsNever") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.endsAfter = function() {
  var item = this.item;
  if(item && item.endsOn) {
    if(item.endsOn.on == "endsAfter") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.endOccurrences = function() {
  var item = this.item;
  if(item && item.endsOn) {
    if(item.endsOn.on == "endsAfter") {
      return item.endsOn.after;
    } else {
      return 10;
    }
  }
}

component.state.endsOn = function() {
  var item = this.item;
  if(item && item.endsOn) {
    if(item.endsOn.on == "endsOn") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.endDate = function() {
  var item = this.item;
  if(item && item.endsOn) {
    if(item.endsOn.on == "endsOn") {
      return moment(item.endsOn.lastDate).format("YYYY-MM-DD");
    } else {
      return moment().add(7, 'days').format("YYYY-MM-DD");
    }
  } 
}

component.state.weekWithRepeats = function() {
  var week = [
    {"index": "Mon", "checked": false}, 
    {"index": "Tue", "checked": false}, 
    {"index": "Wed", "checked": false}, 
    {"index": "Thurs", "checked": false}, 
    {"index": "Fri", "checked": false}, 
    {"index": "Sat", "checked": false}, 
    {"index": "Sun", "checked": false}
  ]
  if(this.item && this.item.repeatOn) {
    var repeatOn = this.item.repeatOn;
    if(repeatOn.length > 0) {
      week.forEach(function(doc) {
        if(repeatOn.indexOf(doc.index) >= 0) {
          doc.checked = true;
        }
      });
    }
  }
  return week;
}

component.state.repeatOnDays = function() {
  var item = this.item;
  if(item) {
    if(item.frequency == "Weekly") {
      return item.repeatOn;
    } 
  }
}

component.state.wagePerHour = function() {
  return this.item.wagePerHour;
}

component.state.mySection = function() {
  var section = Sections.findOne(this.item.section);
  if(section) {
    return section;
  } else {
    return {"name": this.item.section, "_id": this.item.section};
  }
}

component.state.sectionsWithOutSelected = function() {
  var sections = Sections.find({"_id": {$nin: [this.item.section]}});
  return sections;
}

component.action.submit = function(id, info) {
  Meteor.call("editJobItem", id, info, function(err) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      var jobBefore = Session.get("updatingJob");
      var desc = createNotificationText(id, jobBefore, info);

      var options = {
        "type": "edit",
        "title": jobBefore.name + " " + jobBefore.type + " job has been updated",
        "text": desc
      }
      Meteor.call("sendNotifications", id, "job", options, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var goback = Session.get("goBackMenu");
          if(goback) {
            Router.go("menuItemDetail", {"_id": goback});
          }
        }
      });
      
      Router.go("jobItemDetailed", {"_id": id});
    }
  });
};