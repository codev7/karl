Template.adminNav.events({
	'click #addWorker': function(e, instance) {
    e.preventDefault();
    $("#submitWorkerModal").modal("show");
  },

  'click #addWorkerType': function(e, instance) {
    e.preventDefault();
  	$("#addWorkerTypeModal").modal("show");
  },

  'click #addJobType': function(e, instance) {
    e.preventDefault();
  	$("#addJobTypeModal").modal("show")
  },

  'click #addMenuItems': function(e, instance) {
    e.preventDefault();
    Router.go("menuItemSubmitStep1");
  },

  'click #addIngredients': function(e, instance) {
    e.preventDefault();
    $("#addIngredientModal").modal("show");
  },

  'click #addJobItems': function(e, instance) {
    e.preventDefault();
    Router.go("submitJobItem");
  },

  'click #addUnitConversion': function(e, instance) {
    e.preventDefault();
    $("#addUnitConversionModal").modal("show");
  }
});

