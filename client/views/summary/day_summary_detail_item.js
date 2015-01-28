Template.daySummaryDetailItem.helpers({
  'data': function() {
    var doc = {
      'sales': 0,
      'totalTimePlanned': 0, //predicted time of each job
      'totalTimeActual': 0, //time spent from start to end
      'totalWages': 0
    };
    var date = this.date;
    //get sales
    var sales = Sales.findOne({"date": date});
    if(sales) {
      doc.sales = sales.sales;
    }

    var wokers = [];
    var timePlanned = 0;
    var timePlanned_hr = 0;
    var timePlanned_min = 0;
    var timeActual = 0;
    var timeActual_hr = 0;
    var timeActual_min = 0;

    var shifts = Shifts.find({"shiftDate": this.date}).fetch();
    if(shifts.length > 0) {
      shifts.forEach(function(shift) {
        var timeActualShift = 0;
        if(shift.jobs.length > 0) {
          shift.jobs.forEach(function(job) {
            var job = Jobs.findOne(job.job);
            //calc job predicted time
            if(job) {
              if(job.activeTime) {
                timePlanned += parseInt(job.activeTime);
              }

              //calc time spent on each job
              if(job.options) {
                if(job.options.startedAt && job.options.finishedAt) {
                  var start = moment(job.options.startedAt);
                  var end = moment(job.options.finishedAt);
                  if(start && end) {
                    var start_mins_total = start.hour()*60 + start.minute();
                    var end_mins_total = end.hour()*60 + end.minute();

                    var due_mins = end_mins_total - start_mins_total;
                    timeActualShift += due_mins; 
                    timeActual += due_mins
                  }
                }
              }
            }
          });
        }

        //calc wages for each shift
        var shiftDoc = Shifts.findOne(shift);
        // console.log(shiftDoc)
        if(shiftDoc.assignedTo) {
          var worker = Workers.findOne(shiftDoc.assignedTo);
          console.log(worker.hourlyWage, timeActualShift);
          
        }
      });

      //calc job predicted time
      timePlanned_min = parseInt(timePlanned)%60;
      timePlanned_hr = parseInt(timePlanned - timePlanned_min)/60;
      if(timePlanned_hr > 0) {
        doc.totalTimePlanned = timePlanned_hr + ' hours';
      }
      if((timePlanned_hr > 0) && (timePlanned_min > 0)) {
        doc.totalTimePlanned += ' and ';
      }
      if(timePlanned_min > 0) {
        doc.totalTimePlanned += timePlanned_min + ' minutes';
      }

      //calc time spent on each job
      timeActual_min = parseInt(timeActual)%60;
      timeActual_hr = parseInt(timeActual - timeActual_min)/60;
      if(timeActual_hr > 0) {
        doc.totalTimeActual = timeActual_hr + ' hours';
      }
      if((timeActual_hr > 0) && (timeActual_min > 0)) {
        doc.totalTimeActual += ' and '
      }
      if(timeActual_min > 0) {
        doc.totalTimeActual += timeActual_min + ' minutes';
      }

    }
    return doc;

  },

  'addSalesPermission': function() {
    var sales = Sales.findOne({"date": this.date});
    if(sales) {
      return false;
    } else {
      return true;
    }
  }
});

Template.daySummaryDetailItem.events({
  'click .showSubmitSalesModal': function() {
    Session.set("thisDay", this);
    $("#addSales").modal("show");
  },

  'click .showEditSalesModal': function() {
    Session.set("thisDay", this);
    $("#editSales").modal("show");
  }
});