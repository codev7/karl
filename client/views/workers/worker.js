Template.worker.events({
  'click .worker-profile': function(e, instance) {
    Session.set("thisWorker", this);
    $("#workerProfileModal").modal();
  },

  'click .shift-profile-btn': function() {
    Router.go("member", {"_id": this._id, "date": new Date()});
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