Template.worker.events({
  'click .delete-worker-item': function(e, instance) {
    var workerId = this._id;
    var shiftId = $(e.target).parent().parent().parent().attr("data-id");
    Meteor.call("deleteWorkerFromAssignedShift", workerId, shiftId, function(err) {
      if(err) {
        return alert(err.reason);
      }
    });
  } 
});

Template.worker.helpers({
  'deletePermitted': function(event, instance) {
    var worker = Workers.findOne(this._id);
    if(worker) {
      if(worker.availability) {
        return false;
      } else {
        return true;
      }
    }
  }
});