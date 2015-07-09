Meteor.methods({
  'createTemplateShift': function(info) {
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    if(user.isWorker) {
      logger.error("Workers not permitted to create shift templates");
      throw new Meteor.Error(404, "Workers not permitted to create shift templates");
    }
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
      "createdBy": user._id, //add logged in users id
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
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    if(user.isWorker) {
      logger.error("Workers not permitted to edit shift templates");
      throw new Meteor.Error(404, "Workers not permitted to edit shift templates");
    }
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
    if(info.hasOwnProperty('assignedTo')) {
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
      } else {
        updateDoc.assignedTo = null;
      }
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
    var user = Meteor.user();
    if(!user) {
      logger.error("No logged in user");
      throw new Meteor.Error(404, "No logged in user");
    }
    if(user.isWorker) {
      logger.error("Workers not permitted to delete shift templates");
      throw new Meteor.Error(404, "Workers not permitted to delete shift templates");
    }
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