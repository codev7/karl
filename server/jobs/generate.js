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
              var jobItem = JobItems.findOne(job._id);
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
    if(!date) {
      logger.error("Date should be defined");
      throw new Meteor.Error(404, "Date should be defined");
    }

    //endsNever
    var endsNever = JobItems.find({"createdOn": {$lt: new Date(date).getTime()}, "type": "Recurring", "endsOn.on": "endsNever"}).fetch();
    if(endsNever.length > 0) {
      endsNever.forEach(function(job) {

        var id = createNewRecurringJob(job.name, job._id, job.type, job.activeTime, job.section, date);
        if(ids.indexOf(id) < 0) {
          ids.push(id);
        }
      });
    }
    //endsOn date
    var endsOn = JobItems.find({"createdOn": {$lt: new Date(date).getTime()}, "type": "Recurring", "endsOn.on": "endsOn", "endsOn.lastDate": {$lt: new Date(date).getTime()}}).fetch();
    if(endsOn.length > 0) {
      endsNever.forEach(function(job) {
        console.log("=======", job);

        var id = createNewRecurringJob(job.name, job._id, job.type, job.activeTime, job.section, date);
        if(ids.indexOf(id) < 0) {
          ids.push(id);
        }
      });
    }

    //endsAfter occurences
    var endsAfter = JobItems.find({"createdOn": {$lt: new Date(date).getTime()}, "type": "Recurring", "endsOn.on": "endsAfter"}).fetch();
    endsAfter.forEach(function(job) {
      var jobsCount = Jobs.find({"ref": job._id}).count();
      if(jobsCount <= job.endsOn.after) {
        console.log("=======", job);
        var id = createNewRecurringJob(job.name, job._id, job.type, job.activeTime, job.section, date);
        if(ids.indexOf(id) < 0) {
          ids.push(id);
        }
      }
    });

    return ids;
  }
});

function createNewJob(info, time, portions, maxTime, maxPortions) {
  var existingJobs = Jobs.findOne({"name": info.name, "ref": info.ref, "status": "draft", "activeTime": {$lt: maxTimePerDay}});
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
      return id;
    }
  }
}


function createNewRecurringJob(name, ref, type, time, section, date) {
  var existingJob = Jobs.find({
    "name": name, 
    "ref": ref, 
    "type": type, 
    "activeTime": time,    
    "section": section,
    "createdOn": new Date(date).toDateString()
  }).fetch();
  console.log("........", section, existingJob);

  if(existingJob.length <= 0) {
    var doc = {
      "name": name,
      "ref": ref,
      "type": type,
      "status": "draft",
      "options": [],
      "onshift": null,
      "activeTime": time,
      "assignedTo": null,
      "section": section,
      "createdOn": new Date().toDateString(),
      "createdBy": Meteor.userId(),
    }

    var shifts = Shifts.findOne({"shiftDate": new Date(date).toDateString(), "section": section})
    if(shifts) {
      console.log("------shift-----", shifts);
      // shifts.forEach(function(shift) {
        doc.onshift = shifts._id;
        var id = Jobs.insert(doc);
        Shifts.update({"_id": shifts._id}, {$addToSet: {"jobs": id}});
      // });
    } else {
      Jobs.insert(doc);
    }

    console.log("........doc........", doc);

  }

}