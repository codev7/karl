Meteor.methods({
  'setWorkerHoliday': function(workerId, date, onHoliday) {
    if(!workerId) {
      throw new Meteor.Error(404, "WorkerId not found");
    }
    var worker = Workers.findOne(workerId);
    if(!worker) {
      throw new Meteor.Error(404, "Worker does not exist");
    }
    if(!date) {
      throw new Meteor.Error(404, "Date not found");
    }
    if(onHoliday) {
      var alreadyAssigned = Shifts.findOne({"shiftDate": date, "assignedTo": workerId});
      if(alreadyAssigned) {
        console.log("Worker removed from shift", {"workerId": workerId, "date": date, "shift": alreadyAssigned._id});
        Shifts.update({_id: alreadyAssigned._id}, {$set: {"assignedTo": null}});
      }
      var entryExist = Holidays.findOne({"date": date});
      if(!entryExist) {
        var doc = {
          "date": date,
          "workers": []
        }
        doc.workers.push(workerId);
        console.log("Holiday inserted", {"workerId": workerId, "date": date});
        Holidays.insert(doc);
      } else {
        console.log("Holiday added: ", {"date": date, "workerId": workerId});
        Holidays.update({"_id": entryExist._id}, {$addToSet: {"workers": workerId}});
      }
    } else {
      var entryExist = Holidays.findOne({"date": date});
      if(!entryExist) {
        throw new Meteor.Error(404, "Holiday not found");
      }
      console.log("Holiday removed: ", {"date": date, "workerId": workerId});
      Holidays.update({"_id": entryExist._id}, {$pull: {"workers": workerId}});
    }
  }
});