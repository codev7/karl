UI.registerHelper('timeFormat', function(time) {
  var timeFormatted = moment(time).format("hh:mm A");
  return timeFormatted;
});

UI.registerHelper('secondsToMinutes', function(secs) {
  var mins = secs/60;
  return mins;
});

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
        var activeTimeInMins = parseInt(jobItem.activeTime/60)
        jobItem.labourCost = (parseFloat(jobItem.wagePerHour)/60) * activeTimeInMins
      }
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
      var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
      jobItem.prepCostPerPortion = Math.round((totalCost/jobItem.portions) * 100)/100;
      jobItem.labourCost = Math.round(jobItem.labourCost * 100)/100;
      return jobItem;
    }
  }
}

getIngredientItem = function(id) {
  if(id) {
    var item = Ingredients.findOne(id);
    if(item) {
      item.costPerPortionUsed = item.costPerPortion/item.unitSize;
      item.costPerPortionUsed = Math.round(item.costPerPortionUsed * 100)/100;
      if(item.costPerPortionUsed === 0) {
        item.costPerPortionUsed = 0.01;
      }
      return item;
    }
  }
}