Template.dailyShifts.helpers({
  'weekDays': function() {
    var date = Router.current().params._date;
    var daysOfWeek = getDaysOfWholeWeek(date);
    return daysOfWeek;
  },

  'shiftsNWorkers': function() {
    var shiftNWorker = [];
    var shifts = Shifts.find({"shiftDate": this.date}).fetch();
    shifts.forEach(function(shift) {
      var doc = {};
      if(moment(shift.startTime).isValid()) {
        doc.shiftStart = shift.startTime;    
      }
      if(moment(shift.endTime).isValid()) {
        doc.shiftEnd = shift.endTime;
      }
      if(doc.shiftStart && doc.shiftEnd) {
        if(shift.assignedTo) {
          var worker = Workers.findOne(shift.assignedTo);
          if(worker) {
            doc.worker = worker.name;
          }
        }
        shiftNWorker.push(doc);
      }
    });
    return shiftNWorker;
  }
});