Template.menuItem.events({
  'click .menu-item-delete': function(event) {
    event.preventDefault();
    var result = confirm("Are you sure, you want to delete this menu ?");
    if(result) {
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
  }
});