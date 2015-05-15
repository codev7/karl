var component = FlowComponents.define('jobItemDetail', function(props) {
  var id = Router.current().params._id;
  var item = getPrepItem(id);
  this.set("job", item);
});

component.state.id = function() {
  var item = this.get("job");
  if(item) {
    return item._id;
  }
}

component.state.name = function() {
  var item = this.get("job");
  if(item) {
    return item.name;
  }
}

component.state.type = function() {
  var item = this.get("job");
  if(item) {
    return item.type;
  }
}

component.state.section = function() {
  var item = this.get("job");
  if(item) {
    return item.section;
  }
}

component.state.isPrep = function() {
  var item = this.get("job");
  if(item) {
    if(item.type == "Prep") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isRecurring = function() {
  var item = this.get("job");
  if(item) {
    if(item.type == "Recurring") {
      return true;
    } else {
      return false;
    }
  }
}

component.state.ingredients = function() {
  var item = this.get("job");
  if(item) {
    return item.ingredients;
  }
}


component.state.activeTime = function() {
  var item = this.get("job");
  if(item) {
    return item.activeTime;
  }
}

component.state.startsOn = function() {
  var item = this.get("job");
  if(item && item.startsOn) {
    return moment(item.startsOn).format("YYYY-MM-DD");
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

component.state.shelfLife = function() {
  var item = this.get("job");
  if(item) {
    return item.shelfLife;
  }
}

component.state.portions = function() {
  var item = this.get("job");
  if(item) {
    return item.portions;
  }
}

component.state.repeatAt = function() {
  var item = this.get("job");
  if(item) {
    return item.repeatAt;
  }
}

component.state.frequency = function() {
  var item = this.get("job");
  if(item) {
    return item.frequency;
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
        repeat = "Every " + item.repeatOn;
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

