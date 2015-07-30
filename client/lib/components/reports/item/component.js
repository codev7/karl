var component = FlowComponents.define("teamHoursItem", function(props) {
  this.user = props.user;
});


component.state.user = function() {
  if(this.user) {
      return this.user;
  }
}

component.state.totaltime = function() {
  var totalhours = 0;
  var totalmins = 0;
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var date = day.date;
      var shift = Shifts.findOne({
        "assignedTo": userId, 
        "shiftDate": new Date(date).getTime(), 
        $or: [{"status": "finished"}, {"status": "started"}]
      });
      if(shift) {
        var diff = 0;
        if(shift.finishedAt && shift.startedAt){
          diff = (shift.finishedAt - shift.startedAt);
        } else if(shift.startedAt) {
          if(moment(shift.shiftDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
            diff =  (new Date().getTime() - shift.startedAt);
          }
        }
        totalhours += moment.duration(diff).hours();
        totalmins += moment.duration(diff).minutes();
      }  
    });

    if(totalmins >= 60) {
      totalhours +=  Math.floor(totalmins/60);
      totalmins = (totalmins%60);
    }
    var time = null;
    if(totalhours < 10) {
      time = "0" + totalhours;
    } else {
      time = totalhours;
    }

    if(totalmins < 10) {
      time += ".0" + totalmins;
    } else {
      time += "." + totalmins;
    }
    return time;
  }
}

component.state.wage = function() {
  var totalWage = 0;
  if(this.user) {
    var user = this.user;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var totalhours = 0;
      var totalmins = 0;
      var date = day.date;
      var diff = 0;
      var shift = Shifts.findOne(
        {"assignedTo": user._id, 
        "shiftDate": new Date(date).getTime(), 
        $or: [{"status": "finished"}, {"status": "started"}]
      });
      if(shift) {
        if(shift.finishedAt && shift.startedAt){
          diff = (shift.finishedAt - shift.startedAt);
        } else if(shift.startedAt) {
          if(moment(shift.shiftDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
            diff += (new Date().getTime() - shift.startedAt);
          }
        }  
      } 

      if(diff > 0) {
        totalhours = moment.duration(diff).hours();
        totalmins = moment.duration(diff).minutes();

        if(user.profile && user.profile.payrates) {
          var wageDoc = user.profile.payrates;
          var rate = 0;
          if(day.day == "Sunday") {
            rate = parseInt(wageDoc['sunday']);
          } else if(day.day == "Saturday") {
            rate = parseInt(wageDoc['saturday']);
          } else {
            rate = parseInt(wageDoc['weekdays']);
          }
          totalWage += rate * parseInt(totalhours);
          totalWage += (rate/60) * parseInt(totalmins);
        } 
      }
    });
    if(totalWage > 0 && (totalWage == totalWage)) {
      return Math.round(totalWage*100)/100;
    } else {
      return 0;
    }
  }
}

component.state.dailyHours = function() {
  var hours = [];
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var doc = {}
      var date = day.date;
      doc["date"] = date;
      var shift = Shifts.findOne({
        "assignedTo": userId, 
        "shiftDate": new Date(date).getTime(),
        $or: [{"status": "finished"}, {"status": "started"}]
      })
      if(shift) {
        if(shift.startedAt && shift.finishedAt) {
        doc["activeTime"] = (shift.finishedAt - shift.startedAt);
      } else if(shift.startedAt) {
        doc['activeTime'] = (new Date().getTime() - shift.startedAt);
      } else {
        doc['activeTime'] = 0;
      }
    }
    hours.push(doc);
  });
  return hours;
}
}

component.state.dailyShifts = function() {
  var shifts = [];
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var doc = {}
      var date = day.date;
      doc["date"] = date;
      var shift = Shifts.findOne({
        "assignedTo": userId,
        "shiftDate": new Date(date).getTime()
      })
      if(shift) {
        doc["shift"] = shift._id;
      } 
      shifts.push(doc); 
    });
    return shifts;
  }
}

component.state.activeShifts = function() {
  var hash = Session.get("reportHash");
  if((hash == "shifts")||(hash == "shiftsall")) {
    return true;
  } else {
    return false;
  }
}

component.state.activeView = function() {
  var hash = Session.get("reportHash");
  if((hash == "hours")||(hash == "hoursall")) {
    return true;
  } else {
    return false;
  }
}

component.state.activeWage = function() {
  var totalWage = 0;
  if(this.user) {
    var user = this.user;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var totalhours = 0;
      var totalmins = 0;
      var date = day.date;
      var diff = 0;
      var shift = Shifts.findOne(
          {"assignedTo": user._id,
            "shiftDate": new Date(date).getTime(),
            $or: [{"status": "finished"}, {"status": "started"}]
          });
      if(shift) {
        if(shift.finishedAt && shift.startedAt){
          diff = (shift.finishedAt - shift.startedAt);
        } else if(shift.startedAt) {
          if(moment(shift.shiftDate).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD")) {
            diff += (new Date().getTime() - shift.startedAt);
          }
        }
      }

      if(diff > 0) {
        totalhours = moment.duration(diff).hours();
        totalmins = moment.duration(diff).minutes();

        if(user.profile && user.profile.payrates) {
          var wageDoc = user.profile.payrates;
          var rate = 0;
          if(day.day == "Sunday") {
            rate = parseInt(wageDoc['sunday']);
          } else if(day.day == "Saturday") {
            rate = parseInt(wageDoc['saturday']);
          } else {
            rate = parseInt(wageDoc['weekdays']);
          }
          totalWage += rate * parseInt(totalhours);
          totalWage += (rate/60) * parseInt(totalmins);
        }
      }
    });
    if(totalWage > 0 && (totalWage == totalWage)) {
      totalWage= Math.round(totalWage*100)/100;
    } else {
      totalWage= 0;
    }
  }


  var hash = Session.get("reportHash");
  if(hash===null){
    hash="shifts";
    Session.set("reportHash", "shifts");
  }

  if((parseFloat(totalWage)>0)||(hash == "shiftsall")||(hash == "hoursall")) {
    return true;
  } else {
    return false;
  }
}