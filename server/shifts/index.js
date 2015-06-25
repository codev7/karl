Meteor.methods({
  'createShift': function(info) {
    if(!info.startTime) {
      logger.error("Start time not found");
      throw new Meteor.Error(404, "Start time not found");
    }
    if(!info.endTime) {
      logger.error("End time field not found");
      throw new Meteor.Error(404, "End time field not found");
    }
    if(!info.shiftDate) {
      logger.error("Date field not found");
      throw new Meteor.Error(404, "Date field not found");
    }
    if(!info.section) {
      logger.error("Section field not found");
      throw new Meteor.Error(404, "Section field not found");
    }
    if(info.assignedTo) {
      var exsitingAlready = Shifts.findOne({
        "shiftDate": new Date(info.shiftDate).getTime(),
        "startTime": new Date(info.startTime).getTime(),
        "endTime": new Date(info.endTime).getTime(),
        "section": info.section,
        "assignedTo": info.assignedTo
      });
      if(exsitingAlready) {
        logger.error("Duplicating shift");
        throw new Meteor.Error(404, "Duplicating shift");
      }
    }
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(info.shiftDate) <= yesterday) {
    //   logger.error("Can not create a shift for a previous date");
    //   throw new Meteor.Error(404, "Can't create a shift for a previous date");
    // }
    var doc = {
      "startTime": new Date(info.startTime).getTime(),
      "endTime": new Date(info.endTime).getTime(),
      "shiftDate": new Date(info.shiftDate).getTime(),
      "section": info.section,
      "createdBy": Meteor.userId(), //add logged in users id
      "assignedTo": null, //update
      "assignedBy": null, //update
      "jobs": [],
      "status": "draft"
    }
    if(info.assignedTo) {
      var alreadyAssigned = Shifts.findOne({"assignedTo": info.assignedTo, "shiftDate": new Date(info.shiftDate).getTime()});
      if(!alreadyAssigned) {
        doc.assignedTo = info.assignedTo;
      }
    }
    var id = Shifts.insert(doc);
    logger.info("Shift inserted", {"shiftId": id, "date": info.shiftDate});
    return id;
  },

  'editShift': function(info) {
    if(!info._id) {
      logger.error("Shift Id not found")
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(info._id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    var updateDoc = {};
    if(info.startTime) {
      updateDoc.startTime = new Date(info.startTime).getTime();
    }
    if(info.endTime) {
      updateDoc.endTime = new Date(info.endTime).getTime();
    }
    if(info.section) {
      updateDoc.section = info.section;
    }
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(shift.shiftDate) <= yesterday) {
    //   logger.error("Can not edit shifts on previous days");
    //   throw new Meteor.Error(404, "Can not edit shifts on previous days");
    // }
    if(info.shiftDate) {
      if(shift.shiftDate != new Date(info.shiftDate).getTime()) {
        if(shift.assignedTo) {
          var existingWorker = Shifts.findOne({"shiftDate": new Date(info.shiftDate).getTime(), "assignedTo": shift.assignedTo});

          if(existingWorker) {
            logger.error("The worker already has an assigned shift on this date ", {"id": info._id});
            throw new Meteor.Error(404, "The worker already has an assigned shift on this date");
          }
        } 
        updateDoc.shiftDate = new Date(info.shiftDate).getTime();
      }
    }
    if(info.assignedTo) {
      var existInShift = Shifts.findOne({"shiftDate": shift.shiftDate, "assignedTo": info.assignedTo});
      if(existInShift) {
        logger.error("User already exist in a shift", {"date": shift.shiftDate});
        throw new Meteor.Error(404, "Worker has already been assigned to a shift");
      }
      var worker = Meteor.users.findOne(info.assignedTo);
      if(!worker) {
        logger.error("Worker not found");
        throw new Meteor.Error(404, "Worker not found");
      }
      updateDoc.assignedTo = info.assignedTo;
    }
    if(Object.keys(updateDoc).length <= 0) {
      logger.error("Shift has nothing to be updated");
      throw new Meteor.Error(401, "Shift has nothing to be updated");
    }
    Shifts.update({'_id': info._id}, {$set: updateDoc});
    logger.info("Shift details updated", {"shiftId": info._id});
    return;
  },

  'deleteShift': function(id) {
    if(!id) {
      logger.error("Shift Id field not found");
      throw new Meteor.Error(404, "Shift Id field not found");
    }
    var shift = Shifts.findOne(id);
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    // var yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // if(new Date(shift.shiftDate) <= yesterday) {
    //   logger.error("Can not delete shifts on previous days");
    //   throw new Meteor.Error(404, "Can not delete shifts on previous days");
    // }
    if(shift.assignedTo || shift.jobs.length > 0) {
      logger.error("Can't delete a shift with assigned worker or jobs", {"id": id});
      throw new Meteor.Error(404, "Can't delete a shift with assigned worker or jobs");
    }
    Shifts.remove({'_id': id});
    logger.info("Shift deleted", {"shiftId": id});
    return;
  }
});