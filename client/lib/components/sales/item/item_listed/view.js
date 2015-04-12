Template.salesItemsListed.events({
  'click .deleteSalesItem': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var result = confirm("Are you sure, you want to delete this sale item ?");
    if(result) {
      Meteor.call("deleteSalesMenu", id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});