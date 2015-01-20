Template.shiftSummary.helpers({
  'data': function() {
    var doc = {
      'sales': 0,
      'totalTimePlanned': '0:0',
      'totalTimeActual': '0:0',
      'totalWages': 0
    };
    var date = this.date;
    //get sales
    var sales = Revenue.findOne({"date": date});
    if(sales) {
      doc.sales = sales.sales;
    }

    var wokers = [];
    var hoursPlanned = 0;
    var minsPlanned = 0;

    var job_due_hours_total = 0;
    var job_due_mins_total = 0;

    var totalWages = 0;
    //calc wages
    var shifts = Shifts.find({"shiftDate": this.date}).fetch();
    shifts.forEach(function(shift) {
      if(moment(shift.endTime).isValid() && moment(shift.startTime).isValid()) {
        var due = moment.preciseDiff(shift.endTime, shift.startTime).trim();
        var hours = parseInt(due.slice(0, due.indexOf("hours")));
        var mins = parseInt(due.slice(due.indexOf("s")+1, due.indexOf("minutes")))

        if(hours) {
         hoursPlanned += hours;
        }
        if(mins) {
         minsPlanned += mins; 
        }
        if(shift.assignedTo) {
          var worker = Workers.findOne(shift.assignedTo);
          if(worker) {
            if(hours) {
              totalWages += hours * worker.hourlyWage;
            }
            if(mins) {
              totalWages += (mins/60) * worker.hourlyWage;
            }
          }
        }
        //calc jobs actual time
        if(shift.jobs.length > 0) {
          shift.jobs.forEach(function(job) {
            var jobDoc = Jobs.findOne(job.job);
            var jobStartTime = null;
            var jobEndTime = null;
            var job_due = null;
            var job_due_hours = null;
            var job_due_mins = null;

            if(jobDoc.options) {
              if(jobDoc.options.startedAt) {
                jobStartTime = moment(jobDoc.options.startedAt).format("YYYY-MM-DD HH:mm:ss")
              }
              if(jobDoc.options.finishedAt) {
                jobEndTime = moment(jobDoc.options.finishedAt).format("YYYY-MM-DD HH:mm:ss")
              }
              if(jobStartTime && jobEndTime) {
                job_due = moment.preciseDiff(jobEndTime, jobStartTime).trim();
                if(job_due) {
                  if(job_due.indexOf("hours") > 0) {
                    job_due_hours = parseInt(job_due.slice(0, job_due.indexOf("hours"))); 
                    job_due_hours_total += job_due_hours;
                    job_due_mins = parseInt(job_due.slice(job_due.indexOf("s")+1, job_due.indexOf("minutes"))); 
                    job_due_mins_total += job_due_mins;
                  } else if(job_due.indexOf("minutes")) {
                    job_due_mins = parseInt(job_due.slice(0, job_due.indexOf("minutes")));
                    job_due_mins_total += job_due_mins;
                  }
                }
              } 
            }
          });
        }
      }
    });
    if(minsPlanned >= 60) {
      var addi_hours = minsPlanned/60;
      hoursPlanned += addi_hours;
      minsPlanned = minsPlanned%60;
    }
    doc.totalTimePlanned = hoursPlanned + ":" + minsPlanned;
    doc.totalTimeActual = job_due_hours_total + ":" + job_due_mins_total;
    doc.totalWages = totalWages;
    return doc;
  },

  'addSalesPermission': function() {
    var sales = Revenue.findOne({"date": this.date});
    if(sales) {
      return false;
    } else {
      return true;
    }
  }
});

Template.shiftSummary.events({
  'click .showSubmitSalesModal': function() {
    Session.set("thisDay", this);
    $("#addSales").modal("show");
  },

  'click .showEditSalesModal': function() {
    Session.set("thisDay", this);
    $("#editSales").modal("show");
  }
});