var component = FlowComponents.define("teamHoursItem", function(props) {
  this.user = props.user;
});


component.state.user = function() {
  if(this.user) {
    return this.user;
  }
}

component.state.totaltime = function() {
  var total = 0;
  if(this.user) {
    var userId = this.user._id;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var date = day.date;
      var shift = Shifts.findOne({"assignedTo": userId, "shiftDate": new Date(date).getTime(), "status": "finished"})
      if(shift) {
        if(shift.activeHours) {
          total += shift.activeHours;
        } else if(shift.finishedAt && shift.startedAt){
          total += (shift.finishedAt - shift.startedAt);
        } else {
          total += 0;
        }  
      } else {
        total += 0;
      }      
    });
    return total;
  }
}

component.state.totalwage = function() {
  var totalWage = 0;
  if(this.user) {
    var user = this.user;
    var weekNo = Router.current().params.week;
    var week = getDatesFromWeekNumber(weekNo);
    week.forEach(function(day) {
      var time = 0;
      var date = day.date;
      var shift = Shifts.findOne({"assignedTo": user._id, "shiftDate": new Date(date).getTime(), "status": "finished"})
      if(shift) {
        if(shift.activeHours) {
          time = shift.activeHours;
        } else if(shift.finishedAt && shift.startedAt){
          time = (shift.finishedAt - shift.startedAt);
        } else {
          time = 0;
        }  
      } else {
        time = 0;
      } 

      var timeindecimalhours = time/(1000 * 3600);

      if(user.profile && user.profile.payrates) {
        var wageDoc = user.profile.payrates;
        if(day.day == "Sunday") {
          totalWage += (parseInt(wageDoc['sunday']) * timeindecimalhours);
        } else if(day.day == "Saturday") {
          totalWage += (parseInt(wageDoc['saturday']) * timeindecimalhours);
        } else {
          totalWage += (parseInt(wageDoc['weekdays']) * timeindecimalhours);
        }
      } else {

      }
    });
    if(totalWage == totalWage) {
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
      var shift = Shifts.findOne({"assignedTo": userId, "shiftDate": new Date(date).getTime(), "status": "finished"})
      if(shift) {
        if(shift.activeHours) {
          doc['activeHours'] = shift.activeHours;
        } else if(shift.finishedAt && shift.startedAt){
          doc["activeHours"] = (shift.finishedAt - shift.startedAt);
        } else {
          doc["activeHours"] = 0;
        }  
      } else {
        doc['activeHours'] = 0;
      }      
      hours.push(doc); 
    });
    return hours;
  }
}
