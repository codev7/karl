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
	}  
  

  

  
  

  
});