if(Meteor.isServer) {
  Meteor.startup(function() {
    if(JobTypes.find().count() == 0) {
      var types = ['Prep', 'Service'];
      types.forEach(function(type) {
        JobTypes.insert({"type": type});
      });
    }
    if(Categories.find().count() == 0) {
      var categories = ['Main Menu', 'Kids Menu'];
      categories.forEach(function(category) {
        Categories.insert({"name": category});
      });
    }

    if(Statuses.find().count() == 0) {
      var statuses = ['active', 'ideas', 'archived'];
      statuses.forEach(function(status) {
        Statuses.insert({"name": status});
      });
    }

    if(Sections.find().count() == 0) {
      var sections = ["Kitchen hand", "Larder", "Hot section", "Baking", "Pass"];
      sections.forEach(function(section) {
        Sections.insert({"name": section});
      });
    }
  });
}

UI.registerHelper('timeFormat', function(time) {
  var timeFormatted = moment(time).format("hh:mm A");
  return timeFormatted;
});

UI.registerHelper('secondsToMinutes', function(secs) {
  var mins = secs/60;
  return mins;
});

UI.registerHelper("timeFormattedWithDate", function(time) {
  var timeFormatted = moment(time).format('MMMM Do YYYY, h:mm:ss a');
  return timeFormatted;
});

UI.registerHelper("dayFormat", function(date) {
  var dateFormatted = moment(date).format('dddd Do MMMM');
  return dateFormatted;
});

getProfileImage = function(userId) {
  var user = Meteor.users.findOne(userId);
  return user;
}

getUserType = function(id) {
  var user = Meteor.users.findOne(id);
  if(user) {
    if(user.isAdmin) {
      return "Admin";
    } else if(user.isManager) {
      return "Manager";
    } else if(user.isWorker) {
      return "Worker";
    }
  }
}

managerPlusAdminPermission = function() {
  if(isAdmin()) {
    return true;
  } else if(isManager()) {
    return true;
  } else {
    return false;
  }
}

isManagerOrAdmin = function(id) {
  if(id) {
    var user = Meteor.users.findOne(id);
    if(user) {
      if(user.isAdmin) {
        return true;
      } else if(user.isManager) {
        return true;
      } else {
        return false;
      }
    }
  }
}

isAdmin = function() {
  if(Meteor.userId()) {
    return Meteor.user().isAdmin;
  }
}

isWorker = function() {
  if(Meteor.userId()) {
    return Meteor.user().isWorker;
  }
}

isManager = function() {
  if(Meteor.userId()) {
    return Meteor.user().isManager;
  }
}

getDaysOfWeek = function(date) {
  var monday = moment(date).weekday(0).format("YYYY-MM-DD"); // Monday
  var sunday = moment(date).weekday(6).format("YYYY-MM-DD"); // Friday
  return {
    "day1": monday,
    "day7": sunday 
  };
}

getDaysOfWholeWeek = function(date) {
  var doc = [
    {
      "date": moment(date).weekday(0).format("YYYY-MM-DD"), // Sunday
      "day": "Sunday",
      "fMnD": moment(date).weekday(0).format("MM-DD") // Sunday
    },
    {
      "date": moment(date).weekday(1).format("YYYY-MM-DD"), // Monday
      "day": "Monday",
      "fMnD": moment(date).weekday(1).format("MM-DD"), // Monday
    },
    {
      "date": moment(date).weekday(2).format("YYYY-MM-DD"), // Tuesday
      "day": "Tuesday",
      "fMnD": moment(date).weekday(2).format("MM-DD"), // Tuesday
    },
    {
      "date": moment(date).weekday(3).format("YYYY-MM-DD"), // Wednesday
      "day": "Wednesday",
      "fMnD": moment(date).weekday(3).format("MM-DD"), // Wednesday
    },
    {
      "date": moment(date).weekday(4).format("YYYY-MM-DD"), // Thursday
      "day": "Thursday",
      "fMnD": moment(date).weekday(4).format("MM-DD"), // Thursday
    },
    {
      "date": moment(date).weekday(5).format("YYYY-MM-DD"), // Friday
      "day": "Friday",
      "fMnD": moment(date).weekday(5).format("MM-DD"), // Friday
    },
    {
      "date": moment(date).weekday(6).format("YYYY-MM-DD"), // Saturday
      "day": "Saturday",
      "fMnD": moment(date).weekday(6).format("MM-DD"), // Saturday
    }
  ];
  return doc;
}

getDaysOfMonth = function(date) {
  var month_startDate = moment(date).startOf('month').format("YYYY-MM-DD");
  var month_endDate = moment(date).endOf('month').format("YYYY-MM-DD");
  return {"start": month_startDate, "end": month_endDate};
}

getPrepItem = function(id) {
  if(id) {
    var jobItem = JobItems.findOne(id);
    if(jobItem) {
      jobItem.totalIngCost = 0;
      jobItem.prepCostPerPortion = 0;
      if(!jobItem.wagePerHour) {
        jobItem.labourCost = 0;
      } else {
        var activeTimeInMins = parseInt(jobItem.activeTime/60);
        jobItem.labourCost = (parseFloat(jobItem.wagePerHour)/60) * activeTimeInMins;
      }
      if(jobItem.ingredients) {
        if(jobItem.ingredients.length > 0) {
          jobItem.ingredients.forEach(function(ing) {
            var ingItem = getIngredientItem(ing._id);
            if(ingItem) {
              ingItem.totalCost = parseFloat(ingItem.costPerPortionUsed) * parseFloat(ing.quantity);
              jobItem.totalIngCost += parseFloat(ingItem.totalCost);
            }
          });
          jobItem.totalIngCost = jobItem.totalIngCost;
        }
      }
      var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
      if(totalCost > 0 && jobItem.portions > 0) {
        jobItem.prepCostPerPortion = Math.round((totalCost/jobItem.portions) * 100)/100;
      } else {
        jobItem.prepCostPerPortion = 0;
      }
      jobItem.labourCost = Math.round(jobItem.labourCost * 100)/100;
      return jobItem;
    }
  }
}

getIngredientItem = function(id) {
  if(id) {
    var item = Ingredients.findOne(id);
    if(item) {
      if((item.costPerPortion > 0) && (item.unitSize > 0)) {
        item.costPerPortionUsed = item.costPerPortion/item.unitSize;
        item.costPerPortionUsed = Math.round(item.costPerPortionUsed * 100)/100;
        if(item.costPerPortionUsed === 0) {
          item.costPerPortionUsed = 0.01;
        }
      } else {
        item.costPerPortion = 0;
        item.costPerPortionUsed = 0;
      }
      return item;
    }
  }
}

getFirstDateOfISOWeek = function(w, y) {
  var simple = new Date(y, 0, 1 + (w - 1) * 7);
  var dow = simple.getDay();
  var ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  return ISOweekStart;
}