Template.jobItem.events({
  'click .job-profile': function(e, instance) {
    $("#jobProfile").modal("show");
  },

  'click .jobitem': function(e, instance) {
    var status = this.status;
    if(this) {
      if(this.status == "draft") {
        // status = "active";
        return;
      } else if(this.status == "active") {
        status = "finished";
      } else if(this.status == "finished") {
        return;
      } else if(this.status == "assigned") {
        status = "active";
      }
      Meteor.call("setJobStatus", this._id, status, function(err) {
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
  }
});