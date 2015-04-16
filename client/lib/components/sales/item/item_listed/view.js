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
  },

  'focus .editSalesQty': function(event) {
    $(event.target).tooltip();
  },

  'blur .editSalesQty': function(event) {
    $(event.target).tooltip("hide");
  },

  'keypress .editSalesQty': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var id = $(event.target).attr("data-id");
      var menuId = $(event.target).attr("data-menuId");
      var target = $(event.currentTarget)[0];
      var qty = $(event.target).val().trim();
      if(parseInt(qty) == NaN) {
        qty = 0;
      }
      FlowComponents.callAction("keyup", id, menuId, qty, event);
    }
  }
});
