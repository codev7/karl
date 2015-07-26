Meteor.methods({
  generatePreps: function(menuInfo) {
    jobIds = [];
    var maxTimePerDay = 5 * 60 * 60;
    if(menuInfo.length > 0) {
      
      menuInfo.forEach(function(menu) {
        var menuItem = MenuItems.findOne(menu.id);
        if(!menuItem) {
          logger.error("MenuItem not found", menu.id);
        } else {
          if(menuItem.jobItems.length > 0) {

            menuItem.jobItems.forEach(function(job) {
              var jobItem = JobItems.findOne({"_id": job._id, "type": "Prep"});
              if(!jobItem) {
                logger.error("MenuItem not found", menu.id);
              } else {
                var portionsRequired = menu.quantity * job.quantity;
                var timeRequired = portionsRequired * (jobItem.activeTime/jobItem.portions);
                var maxPortions = (jobItem.portions/jobItem.activeTime) * maxTimePerDay;
                var count = timeRequired % maxTimePerDay;
                var info = {
                  "name": jobItem.name,
                  "type": jobItem.type,
                  "ref": jobItem._id
                }
                if(timeRequired > maxTimePerDay) {
                  if(count > 0) {
                    for(var i=1; count>=i; i++) {
                      createNewJob(info, maxTimePerDay, maxPortions, maxTimePerDay, maxPortions);
                    }
                    var restTime = timeRequired - (maxTimePerDay * count);
                    var restPortions = portionsRequired - (maxPortions * count);
                    if(restTime > 0) {
                      createNewJob(info, restTime, restPortions, maxTimePerDay, maxPortions);
                    }
                  } else {
                    createNewJob(info, timeRequired, portionsRequired, maxTimePerDay, maxPortions);
                  }
                } else {
                  createNewJob(info, timeRequired, portionsRequired, maxTimePerDay, maxPortions);
                }
              }
            });
          }
        }
      });
    }
    return jobIds;
  },

  generateRecurrings: function(date) {
    var ids = [];
    var allJobItems = [];
    var d = new Date(date);
    var weekday = new Array(7);
    weekday[0]=  "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wed";
    weekday[4] = "Thurs";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var day = weekday[d.getDay()];

    if(!date) {
      logger.error("Date should be defined");
      throw new Meteor.Error(404, "Date should be defined");
    }

    //endsNever
    var endsNever = JobItems.find({
      "type": "Recurring", 
      "endsOn.on": "endsNever",
      "startsOn": {$lte: new Date(date).getTime()}
    }).fetch();
    if(endsNever.length > 0) {
      allJobItems = allJobItems.concat(endsNever);
    }
    //endsOn date
    var endsOn = JobItems.find({
      "type": "Recurring", 
      "startsOn": {$lte: new Date(date).getTime()},
      "endsOn.on": "endsOn", 
      "endsOn.lastDate": {$gte: new Date(date)}
    }).fetch();
    if(endsOn.length > 0) {
       allJobItems = allJobItems.concat(endsOn);
    }
    //endsAfter occurences
    var endsAfter = JobItems.find({
      "type": "Recurring", 
      "endsOn.on": "endsAfter",
      "startsOn": {$lte: new Date(date).getTime()}
    }).fetch();
    if(endsAfter.length > 0) {
      endsAfter.forEach(function(job) {
        var jobsCount = Jobs.find({"ref": job._id}).count();
        if(jobsCount < job.endsOn.after) {
          allJobItems.push(job);
        }
      });
    }

    if(allJobItems.length > 0) {
      allJobItems.forEach(function(job) {
        if(job.frequency == "Daily") {
          var id = createNewRecurringJob(job.name, job._id, job.type, job.activeTime, job.section, job.repeatAt, date);
          if(ids.indexOf(id) < 0) {
            ids.push(id);
          }
        } else if(job.frequency == "Weekly") {
          if(job.repeatOn.indexOf(day) >= 0) {
            var id = createNewRecurringJob(job.name, job._id, job.type, job.activeTime, job.section, job.repeatAt, date);
            if(ids.indexOf(id) < 0) {
              ids.push(id);
            }
          }
        }
      }); 
      return ids;
    }

  }
});

function createNewJob(info, time, portions, maxTime, maxPortions) {
  var existingJobs = Jobs.findOne({"name": info.name, "ref": info.ref, "status": "draft", "activeTime": {$lt: maxTime}});
  if(existingJobs) {
    var newTime = existingJobs.activeTime + time;
    var newPortions = existingJobs.portions + portions;

    if(newTime > maxTime) {
      var id = Jobs.update({"_id": existingJobs._id}, {$set: {"activeTime": maxTime, "portions": maxPortions}});
      if(jobIds.indexOf(id) < 0) {
        jobIds.push(id);
      }
      newTime = newTime - maxTime;
      newPortions = newPortions - maxPortions;
      if(newTime > maxTime) {
        var repeat = newTime % maxTime;
        if(repeat > 0) {
          for(var i=1; i<=repeat; i++) {
            createNewJob(info, maxTime, maxPortions, maxTime, maxPortions);
          }
          var restTime = newTime - (maxTime * repeat);
          var restPortions = newPortions - (maxPortions * repeat);
          if(restTime > 0) {
            createNewJob(info, restTime, restPortions, maxTimePerDay, maxPortions);
          }
        }     
      }
    } else {
      var id = Jobs.update({"_id": existingJobs._id}, {$set: {"activeTime": newTime, "portions": newPortions}});
      if(jobIds.indexOf(id) < 0) {
        jobIds.push(id);
        return id;
      }
    }
  } else {
    var doc = {
      "name": info.name,
      "ref": info.ref,
      "type": info.type,
      "status": "draft",
      "options": [],
      "onshift": null,
      "portions": portions,
      "activeTime": time,
      "assignedTo": null,
      "createdOn": new Date().toDateString(),
      "createdBy": Meteor.userId(),
      "ingredients": [],
    }
    var id = Jobs.insert(doc);
    if(jobIds.indexOf(id) < 0) {
      jobIds.push(id);
      logger.info("New recurring job inserted", id);
      return id;
    }
  }
}


createNewRecurringJob = function(name, ref, type, time, section, startAt, date) {
  var thisDate = new Date(date);
  var startAtDate = new Date(startAt);
  var shifts = Shifts.find({"shiftDate": thisDate.getTime(), "section": section}).fetch();

  var starting = new Date(thisDate.getFullYear(), thisDate.getMonth(), thisDate.getDate(), startAtDate.getHours(), startAtDate.getMinutes());

  if(shifts.length > 0) {
    shifts.forEach(function(shift) {
      var doc = {
        "name": name,
        "ref": ref,
        "type": type,
        "status": "assigned",
        "options": [],
        "onshift": shift._id,
        "activeTime": time,
        "assignedTo": null,
        "section": section,
        "createdOn": new Date(date).toDateString(),
        "startAt": new Date(starting).getTime()
      }

      var existingJob = Jobs.find(doc).fetch();
      if(existingJob.length <= 0) {
        doc.createdBy = Meteor.userId();
        var id = Jobs.insert(doc);
        Shifts.update({"_id": shift._id}, {$addToSet: {"jobs": id}});
        return id;
      }
    });
  }

}