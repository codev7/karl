Template.shiftWorker.helpers({
	shiftName: function() {
	 	var thisShift = this;
	 	if(moment(this.shiftStart).isValid()) {
	 		var startShift = moment(this.shiftStart).format("hh:mm A");
	 	} 
	 	if(moment(this.endShift).isValid()) {
	 		var endShift = moment(this.shiftEnd).format("hh:mm A");
	 	}
	 	if(startShift && endShift) {
	 		return {"startShift": startShift, "endShift": endShift};
	 	} else {
	 		return null;
	 	}
	 	
	}
});