var component = FlowComponents.define("pageHeading", function(props) {
  this.title = props.title;
  this.category = props.category;
  this.subCategory = props.subCategory;
  this.type = props.name;
  this.id = props.id;
});

component.state.title = function() {
  return this.title;
} 

component.state.type = function() {
  return this.type;
} 

component.state.category = function() {
  return this.category;
}

component.state.subCategory = function() {
  return this.subCategory;
}

component.state.publishedOn = function() {
  if(this.type == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function(day) {
      if(day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shift = Shifts.findOne({"shiftDate": {$in: dates}, "published": true});
    if(shift && shift.publishedOn) {
      return shift.publishedOn;
    }
  }
}

component.state.id = function() {
  if(this.id) {
    return this.id;
  } else if(Router.current().params._id) {
    return Router.current().params._id;
  }
}

component.state.isMenuList = function() {
  if(this.type == "menulist") {
    return true;
  } else {
    return false;
  }
}

component.state.isActualSales = function() {
  if(this.type == "actualsales") {
    return true;
  } else {
    return false;
  }
}

component.state.isDailyRoster = function() {
  if(this.type == "dailyroster") {
    return true;
  } else {
    return false;
  }
}

component.state.routeDate = function() {
  var date = Router.current().params.date;
  if(date) {
    return date;
  }
}

component.state.isMenuListSubscribed = function() {
  if(this.type == "menulist") {
    var result = Subscriptions.findOne({"_id": "menulist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isMenuDetailed = function() {
  if(this.type == "menudetailed") {
    return true;
  } else {
    return false;
  }
}

component.state.isJobItemDetailed = function() {
  if(this.type == "jobitemdetailed") {
    return true;
  } else {
    return false;
  }
}

component.state.isJobItemSubscribed = function() {
  var userId = Meteor.userId();
  var jobSubs = Subscriptions.findOne({"_id": Session.get("thisJobItem"), "subscribers": userId});
  if(jobSubs) {
    return true;
  } else {
    return false;
  }
}


component.state.isJobsList = function() {
  if(this.type == "jobslist") {
    return true;
  } else {
    return false;
  }
}

component.state.isMenuSubscribed = function() {
  if(this.type == "menudetailed") {
    var userId = Meteor.userId();
    var menuSubs = Subscriptions.findOne({"_id": Session.get("thisMenuItem"), "subscribers": userId});
    if(menuSubs) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isJobListSubscribed = function() {
  if(this.type == "jobslist") {
    var result = Subscriptions.findOne({"_id": "joblist", "subscribers": Meteor.userId()});
    if(result) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isIngredientsList = function() {
  if(this.type == "ingredientslist") {
    return true;
  } else {
    return false;
  }
}

component.state.weeklyNavigation = function() {
  if(this.type == "cafeforecasting" || this.type == "teamHoursReport" || this.type == "weeklyroster") {
    return true; 
  } else {
    return false;
  }
}

component.state.isManagerOrAdmin = function() {
  if(isAdmin() || isManager()) {
    return true;
  } else {
    return false;
  }
}

component.state.isWeeklyTemplate = function() {
  if(this.type == "weeklyrostertemplate") {
    return true;
  } else {
    return false;
  }
}

component.state.isWeeklyRosterCreated = function() {
  if(this.type == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function(day) {
      if(day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shifts = Shifts.find({"shiftDate": {$in: dates}}).fetch();
    if(shifts.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isWeeklyRosterPublished = function() {
  if(this.type == "weeklyroster") {
    var weekNo = Session.get("thisWeek");
    var week = getDatesFromWeekNumber(parseInt(weekNo));
    var dates = [];
    week.forEach(function(day) {
      if(day && day.date) {
        dates.push(new Date(day.date).getTime())
      }
    });
    var shifts = Shifts.find({"shiftDate": {$in: dates}, "published": true}).fetch();
    if(shifts.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}

component.state.isStockTakeList = function() {
  if(this.type == "stocktakeList") {
    return true;
  } else {
    return false;
  }
}

component.state.date = function() {
  return moment().format("YYYY-MM-DD");
}