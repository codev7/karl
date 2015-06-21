Meteor.methods({
  'createWeeklyPayroll': function(week, userId) {
    var user = Meteor.users.findOne(userId);
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    if(week.length == 7) {
      week.forEach(function(day) {
        var payrollExist = Payroll.findOne({"user": userId, "date": new Date(day.date).getTime()})
        if(payrollExist) {
          logger.error("User already has a payroll for the date");
          throw new Meteor.Error(404, "User already has a payroll for the date");
        }

        var doc = {
          "user": user._id,
          "date": new Date(day.date).getTime(),
          "shift": null,
          "rate": user.profile.payrates[day.day.toLowerCase()],
          "hours": 0,
          "createdOn": new Date().getTime(),
          "createdBy": Meteor.userId()
        }
        var shift = Shifts.findOne({"assignedTo": userId, "shiftDate": new Date(day.date).getTime(), "status": "finished"})
        if(shift) {
          doc.shift = shift._id;
          if(shift.activeHours) {
            doc['hours'] = shift.activeHours;
          } else if(shift.finishedAt && shift.startedAt){
            doc["hours"] = (shift.finishedAt - shift.startedAt);
          } else {
            doc["hours"] = 0;
          }  
        } else {
          doc['hours'] = 0;
        }      
        var id = Payroll.insert(doc);
        logger.info("Payroll entrey created for user ", userId);
      });   
    }
  },

  'createPayroll': function(userId, shift) {
    var user = Meteor.users.findOne(userId);
    if(!user) {
      logger.error("User not found");
      throw new Meteor.Error(404, "User not found");
    }
    var shift = Shifts.findOne({"_id": shift, "status": "finished", "assignedTo": userId});
    if(!shift) {
      logger.error("Shift not found");
      throw new Meteor.Error(404, "Shift not found");
    }
    var payrollExist = Payroll.findOne({"user": userId, "date": new Date(shift.shiftDate).getTime()}) 
    if(payrollExist) {
      logger.error("User already has a payroll for the date");
      throw new Meteor.Error(404, "User already has a payroll for the date");
    }
    var paydate = 'weekdays';
    var day = new Date(shift.shiftDate).getDay();
    if(day == 0) {
      paydate = 'sunday';
    } else if(day == 6) {
      paydate = 'saturday';
    }

    var doc = {
      "user": userId,
      "date": new Date(shift.shiftDate).getTime(),
      "shift": shift._id,
      "rate": user.profile.payrates[day],
      "time": 0,
      "createdOn": new Date().getTime(),
      "createdBy": Meteor.userId()
    }
    if(shift) {
      if(shift.activeHours) {
        doc['time'] = shift.activeHours;
      } else if(shift.finishedAt && shift.startedAt){
        doc["time"] = (shift.finishedAt - shift.startedAt);
      } else {
        doc["time"] = 0;
      }  
    } else {
      doc['time'] = 0;
    }      
    var id = Payroll.insert(doc);
    logger.info("Payroll entry created for user ", userId);
  }
});