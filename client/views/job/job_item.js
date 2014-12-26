Template.jobItem.events({
  'click .job-profile': function(e, instance) {
    Session.set("thisJob", this);
    $("#jobProfile").modal("show");
  },

  'click .set-job-status': function(e, instance) {
    if(this) {
      Meteor.call("setJobStatus", this._id, function(err) {
        if(err) {
          return alert(err.reason);
        }
      }); 
    }
  }
});

Template.jobItem.helpers({
  'setStatusPermission': function() {
    var permitted = true;
    if(this.status == "draft") {
      permitted = false;
    }
    return permitted;
  },

  'jobHeight': function() {
    return (this.activeTime * 1);
  }
});