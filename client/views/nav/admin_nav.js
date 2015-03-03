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

  'click #addMenuItems': function(e, instance) {
    Router.go("menuItemSubmitStep1");
  },

  'click #addIngredients': function(e, instance) {
    $("#addIngredientModal").modal("show");
  },

  'click #addJobItems': function(e, instance) {
    Router.go("submitJobItem");
  }
});

