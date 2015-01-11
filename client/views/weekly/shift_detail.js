Template.shiftDetail.helpers({
	'data': function() {
		var doc = {};
		var date = this.date;
		//get sales
		var sales = Revenue.findOne({"date": date});
		if(sales) {
			doc.sales = sales.sales;
		}

		var wokers = [];
		var hoursPlanned = 0;
		var minsPlanned = 0;
		var totalWages = 0;
         var shifts = Shifts.find({"shiftDate": this.date}).fetch();
        shifts.forEach(function(shift) {
    	if(moment(shift.endTime).isValid() && moment(shift.startTime).isValid()) {
    		var due = moment.preciseDiff(shift.endTime, shift.startTime).trim();
    		var hours = parseInt(due.slice(0, due.indexOf("hours")));
    		var mins = parseInt(due.slice(due.indexOf("s")+1, due.indexOf("minutes")))
    	}
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
    });
    if(minsPlanned >= 60) {
    	var addi_hours = minsPlanned/60;
    	hoursPlanned += addi_hours;
    	minsPlanned = minsPlanned%60;
    }
    doc.totalTimePlanned = hoursPlanned + ":" + minsPlanned;
    doc.totalTimeActual = hoursPlanned + ":" + minsPlanned;
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

Template.shiftDetail.events({
	'click .showSubmitSalesModal': function() {
		Session.set("thisDay", this);
		$("#addSales").modal("show");
	}
});