Template.adminNav.events({
	'click #addWorker': function(e, instance) {
    $("#submitWorkerModal").modal("show");
  },

  'click #addWorkerType': function(e, instance) {
  	$("#addWorkerTypeModal").modal("show");
  },

  'click #addJobType': function(e, instance) {
  	$("#addJobTypeModal").modal("show")
  },

  'click #addMenu': function(e, instance) {
    $("#addMenuItemModal").modal("show");
  },

  'click #addIngredients': function(e, instance) {
    $("#addIngredientModal").modal("show");
  }
});

