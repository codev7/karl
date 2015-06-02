Template.userDetailed.events({
  'click .changeUserPermission': function(event) {
    event.preventDefault();
    var type = $(event.target).attr("data-type");
    var id = $(event.target).closest("tr").attr("data-id");
    Meteor.call("changeUserPermission", id, type, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});