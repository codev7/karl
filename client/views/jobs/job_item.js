Template.jobItem.events({
  'click .job-profile': function(e, instance) {
    Session.set("thisJob", this);
    $("#jobProfile").modal("show");
  },

  'click .set-job-status': function(e, instance) {
    var state = $(e.target).attr("data-state");
    if(this && state) {
      Meteor.call("changeJobStatus", this._id, state, function(err) {
        if(err) {
          return alert(err.reason);
        }
      }); 
    }
  }
});

Template.jobItem.helpers({
  'changeStatePermission': function() {
    var permitted = true;
    var routeName = Router.current().route.getName();
    if(this.status == "draft") {
      permitted = false;
    } else if(routeName == "member") {
      permitted = true;
    } else {
      permitted = false;
    }
    return permitted;
  },

  'jobHeight': function() {
    return this.activeTime;
  }
});

