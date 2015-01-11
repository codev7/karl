Template.submitJobType.events({
	'submit form': function(event) {
    event.preventDefault();
		var jobType = $(event.target).find('[name=jobType]').val();
		if(!jobType || !jobType.trim()) {
			return alert("Add job type");
		} 
		Meteor.call("addJobType", jobType, function(err) {
			if(err) {
				console.log(err.reason);
				return;
			} else {
				$("#addJobTypeModal").modal("hide");
			}
		});
	}
});