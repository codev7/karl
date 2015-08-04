var component = FlowComponents.define('jobItemDetail', function(props) {
  var id = Router.current().params._id;
  this.id = id;
});

component.state.job = function() {
  var id = this.id;
  var item = getPrepItem(id);
  this.set("job", item);
  return item;
}

component.state.section = function() {
  var item = this.get("job");
  if(item && item.section) {
    return Sections.findOne(item.section).name;
  }
}

component.state.isPrep = function() {
  var item = this.get("job");
  if(item) {
    if(item.type) {
      var type = JobTypes.findOne(item.type);
      if(type && type.name == "Prep") {
        return true; 
      } else {
        return false;
      }
    }
  }
}

component.state.isRecurring = function() {
  var item = this.get("job");
  if(item) {
    if(item.type) {
      var type = JobTypes.findOne(item.type);
      if(type && type.name == "Recurring") {
        return true; 
      } else {
        return false;
      }
    }
  }
}

component.state.ingExists = function() {
  var item = this.get("job");
  if(item.ingredients && item.ingredients.length > 0) {
    return true;
  } else {
    return false;
  }
}


component.state.isChecklist = function() {
  var item = this.get("job");
  if(item && item.checklist && item.checklist.length > 0) {
    return true;
  }
}

component.state.checklist = function() {
  var item = this.get("job");
  if(item && item.checklist) {
    return item.checklist;
  }
}

component.state.startsOn = function() {
  var item = this.get("job");
  if(item && item.startsOn) {
    return moment(item.startsOn).format("YYYY-MM-DD");
  }
}

component.state.repeatAt = function() {
  var item = this.get("job");
  if(item && item.repeatAt) {
    return moment(item.repeatAt).format("hh:mm A");
  }
}

component.state.endsOn = function() {
  var item = this.get("job");
  var ends = null;
  if(item) {
    if(item.endsOn) {
      if(item.endsOn.on == "endsNever") {
        ends = "Never";
      } else if(item.endsOn.on == "endsAfter") {
        ends = "After " + item.endsOn.after + " occurrences"; 
      } else if(item.endsOn.on == "endsOn") {
        ends = "On " + moment(item.endsOn.lastDate).format("YYYY-MM-DD");
      }
    }
    return ends;
  }
}

component.state.isWeekly = function() {
  var item = this.get("job");
  if(item) {
    if(item.frequency == "Weekly") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.repeatOnDays = function() {
  var item = this.get("job");
  var repeat = null;
  if(item) {
    if(item.frequency == "Weekly") {
      if(item.repeatOn.length > 0) {
        if(item.repeatOn.length == 7) {
          repeat = "Everyday";
        } else {
          repeat = "Every " + item.repeatOn;
        }
      }
      return repeat;
    } 
  }
}


component.state.description = function() {
  var item = this.get("job");
  if(item) {
    return item.description;
  }
}

component.state.labourCost = function() {
  var item = this.get("job");
  if(item) {
    return item.labourCost;
  }
}

component.state.prepCostPerPortion = function() {
  var item = this.get("job");
  if(item) {
    return item.prepCostPerPortion;
  }
}

component.state.isManagerOrAdmin = function() {
  var userId = Meteor.userId();
  return isManagerOrAdmin(userId);
}


