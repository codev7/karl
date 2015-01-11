Meteor.methods({
	'addWorkerType': function(type) {
		if(!type) {
			throw new Meteor.Error("Type field null");
		}
		var existingtype = WorkerTypes.findOne({'type': type});
		if(!existingtype) {
			WorkerTypes.insert({'type': type});
		} else {
			throw new Meteor.Error("Exsiting worker type");
		}
	},

	'addJobType': function(type) {
		if(!type) {
			throw new Meteor.Error("Job type field null");
		}
		var existingtype = JobTypes.findOne({'type': type});
		if(!existingtype) {
			JobTypes.insert({'type': type});
		} else {
			throw new Meteor.Error("Exsiting job type");
		}
	}  
  
});