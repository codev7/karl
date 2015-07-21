var subs = new SubsManager();

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
            subs.subscribe("ingredients", [id]);
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

//returns dates and days of week in a array with given week number
getDatesFromWeekNumber = function(weekNo) {
  var week = [];
  var daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  daysOfWeek.forEach(function(day) {
    var doc = {};
    if(day == "Sunday") {
      doc["date"] = moment().day(day).week(weekNo).add(7, "d").format("YYYY-MM-DD");
    } else {
      doc["date"] = moment().day(day).week(weekNo).format("YYYY-MM-DD");
    }
    doc["day"] = day;
    week.push(doc);
  });
  return week;
}

getWeekStartEnd = function(week) {
  var monday = getFirstDateOfISOWeek(week, new Date().getFullYear());
  var sunday = new Date(new Date(monday).setDate(new Date(monday).getDate() + 6)).setHours(12);
  sunday = new Date(sunday);

  return {
    "monday": monday,
    "sunday": sunday
  }
}

createNotificationText = function(id, oldItemData, newInfo) {
  var list = [];
  if(oldItemData) {
    for(var key in newInfo) {
      var title = "";
      var prefix = "";
      var postfix = "";

      if(key == "name") {
        title = "Name ";
      } else if(key == "type") {
        title = "Type";
      } else if(key == "portions") {
        title = "Portions ";
      } else if(key == "shelfLife") {
        title = "Shelf life ";
        postfix = " days";
      } else if(key == "wagePerHour") {
        title = "Hourly wage ";
        prefix = "$ ";
      } else if(key == "activeTime") {
        title = "Active time";
        postfix = " mins";
      } else if(key == "recipe") {
        title = "Recipe ";
      } else if(key == "description") {
        title = "Description ";
      } else if(key == "repeatAt") {
        title == "Repeats at ";
      } else if(key == "checklist") {
        title = "Checklist ";
      } else if(key == "endsOn") {
        title = "Ends on ";
      } else if(key == "ingredients") {
        title = "Ingredients ";
      } else if (key == "section") {
        title = "Section ";
      } else if(key == "frequency") {
        title = "Frequency ";
      } else if(key == "salesPrice") {
        prefix = "$ "
        title = "Sales Price ";
      } else if(key == "category") {
        title = "Category ";
      } else if(key == "status") {
        title = "Status ";
      }

      if(key == 'recipe' || key == 'description' || key == "checklist") {
        if(oldItemData.type == newInfo.type) {
          var str = title + " changed";
          list.push("<br>" + str);
        }
      } else {
        var str = title + " changed from '";
        if(key == "name" || key == "portions" || 
          key == "shelfLife" || key == "wagePerHour" || 
          key == "salesPrice" || key == 'status') {
          if(oldItemData.type == newInfo.type) {
            str += prefix + oldItemData[key] + postfix + "' to '" + prefix + newInfo[key] + postfix + "'";
            list.push("<br>" + str);
          }
        } else if(key == "activeTime") {
          if(oldItemData.type == newInfo.type) {
            str += prefix + parseInt(oldItemData[key])/60 + postfix + "' to '" + prefix + parseInt(newInfo[key]) + postfix + "'";
            list.push("<br>" + str);           
          }
        } else if (key == "type") {
          if(oldItemData.type != newInfo.type) {
            str += oldItemData[key] + "' to '" + newInfo[key] + "'";
            list.push("<br>" + str);
          }
        } else if(key == "ingredients") {
          if(oldItemData.type == newInfo.type) {
            if(oldItemData.ingredients.length != newInfo.ingredients.length) {
              var str = title + " changed";
              list.push("<br>" + str);
            }
          }
        // } else if(key == "checklist") {
        //   if(oldItemData.type == newInfo.type) {
        //     if(oldItemData.checklist || newInfo.checklist) {
        //       if(oldItemData.checklist.length != newInfo.checklist.length) {
        //         var str = title + " changed";
        //         list.push("<br>" + str);
        //       }
        //     }
        //   }
        } else if(key == "endsOn") {
          if(oldItemData.type == newInfo.type) {
            if(oldItemData.endsOn.on != newInfo.endsOn.on) {
              var str = title + "changed from '" + oldItemData.endsOn.on + "' to '" + newInfo.endsOn.on + "'";
              list.push("<br>" + str);
            }
          }
        } else if(key == "category") {
          if(oldItemData.type == newInfo.type) {
            if(oldItemData.category != newInfo.category) {
              var str = title + "changed from '" + Categories.findOne(oldItemData.category).name + "' to '" + Categories.findOne(newInfo.category).name + "'";
              list.push("<br>" + str);
            }
          }
        } else if(key == "section") {
          if(oldItemData.type == newInfo.type) {
            var str = title + "changed from '" + Sections.findOne(oldItemData.section).name + "' to '" + Sections.findOne(newInfo.section).name + "'";
            list.push("<br>" + str);
          }
        }
      }
    }
  }
  return list;
}