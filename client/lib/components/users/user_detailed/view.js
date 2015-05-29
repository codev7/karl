Template.userDetailed.events({
  'click .changeUserPermission': function(event) {
    event.preventDefault();
    var type = $(event.target).attr("data-type");
    Meteor.call("changeUserPermission", this._id, type, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});