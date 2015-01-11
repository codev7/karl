Template.submitWorkerType.events({
	'submit form': function(event) {
    event.preventDefault();
		var workerType = $(event.target).find('[name=workerType]').val();
		if(!workerType) {
			return alert("Add worker type");
		} 
		Meteor.call("addWorkerType", workerType, function(err) {
			if(err) {
				console.log(err.reason);
				return;
			} else {
				$("#addWorkerTypeModal").modal("hide");
			}
		});
	}
});