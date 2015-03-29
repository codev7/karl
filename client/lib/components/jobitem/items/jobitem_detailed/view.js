Template.jobItemDetailed.events({
  'click .deleteJobItem': function(event) {
    event.preventDefault();
    var result = confirm("Are you sure, you want to delete this item ?");
    if (result == true) {
      Meteor.call("deleteJobItem", this._id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});