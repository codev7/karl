Template.worker.events({
  'click .worker-profile': function(e, instance) {
    Session.set("thisWorker", this);
    $("#workerProfileModal").modal();
  }
});

Template.worker.helpers({
  'resigned': function() {
    var worker = this;
    if(worker.resign) {
      return "resigned-worker";
    } else {
      return "active-worker";
    }
  }
});