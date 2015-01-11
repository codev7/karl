Template.adminNav.events({
	'click #addWorker': function(e, instance) {
    $("#submitWorkerModal").modal("show");
  },

  'click #addWorkerType': function(e, instance) {
  	$("#addWorkerTypeModal").modal("show");
  },

  'click #addJobType': function(e, instance) {
  	$("#addJobTypeModal").modal("show")
  }
});

