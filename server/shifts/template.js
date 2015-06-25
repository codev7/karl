Meteor.methods({
  'createTemplateShift': function(info) {
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
      var alreadyAssigned = TemplateShifts.findOne({"assignedTo": info.assignedTo, "shiftDate": new Date(info.shiftDate).getTime()});
      if(!alreadyAssigned) {
        doc.assignedTo = info.assignedTo;
      }
    }
    var id = TemplateShifts.insert(doc);
    logger.info("Shift template inserted", {"shiftId": id, "date": info.shiftDate});
    return id;
  },

  'editTemplateShift': function(info) {
    if(!info._id) {
      logger.error("Shift template Id not found")
      throw new Meteor.Error(404, "Shift template Id field not found");
    }
    var shift = TemplateShifts.findOne(info._id);
    if(!shift) {
      logger.error("Shift template not found");
      throw new Meteor.Error(404, "Shift template not found");
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
    if(info.shiftDate) {
      if(shift.shiftDate != new Date(info.shiftDate).getTime()) {
        if(shift.assignedTo) {
          var existingWorker = TemplateShifts.findOne({"shiftDate": new Date(info.shiftDate).getTime(), "assignedTo": shift.assignedTo});

          if(existingWorker) {
            logger.error("The worker already has an assigned shift on this date ", {"id": info._id});
            throw new Meteor.Error(404, "The worker already has an assigned shift on this date");
          }
        } 
        updateDoc.shiftDate = new Date(info.shiftDate).getTime();
      }
    }
    if(info.assignedTo) {
      var existInShift = TemplateShifts.findOne({"shiftDate": shift.shiftDate, "assignedTo": info.assignedTo});
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
      logger.error("Shift template has nothing to be updated");
      throw new Meteor.Error(401, "Shift template has nothing to be updated");
    }
    TemplateShifts.update({'_id': info._id}, {$set: updateDoc});
    logger.info("Shift template details updated", {"shiftId": info._id});
    return;
  },

  'deleteTemplateShift': function(id) {
    if(!id) {
      logger.error("Shift template Id field not found");
      throw new Meteor.Error(404, "Shift template Id field not found");
    }
    var shift = TemplateShifts.findOne(id);
    if(!shift) {
      logger.error("Shift template not found");
      throw new Meteor.Error(404, "Shift template not found");
    }
    TemplateShifts.remove({'_id': id});
    logger.info("Shift template deleted", {"shiftId": id});
    return;
  }
});

Meteor.publish("shiftTemplates", function() {
  return TemplateShifts.find();
});