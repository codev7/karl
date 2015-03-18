Template.menuItem.events({
  'click .removeMenuItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    if(id) {
      Meteor.call("deleteMenuItem", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});