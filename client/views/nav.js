Template.layout.events({
  'click #addJob': function(e, instance) {
    $("#submitJobModal").modal("show");
  },

  'click #addShift': function(e, instance) {
    $("#submitShiftModal").modal("show");
  }
});