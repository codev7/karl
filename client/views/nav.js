Template.layout.events({
  'click #addJob': function(e, instance) {
    $("#submitJobModal").modal("show");
  },

  'click #addShift': function(e, instance) {
    $("#submitShiftModal").modal("show");
  },

  'click #addWorker': function(e, instance) {
    $("#submitWorkerModal").modal("show");
  },

  'click #adminPanel': function(e, instance) {
    e.preventDefault();
    Router.go("admin");
  }
});