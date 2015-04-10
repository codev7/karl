Template.editSalesItem.events({
  'keyup .saleItem': _.throttle(function(event) {
    $(event.target).next().removeClass("hide");
    var text = $(event.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'blur .saleItem': function(event) {
    $(event.target).next().addClass("hide");
  },

  'keypress .saleQty': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      var menuName = $(".saleItem").val();
      var qty = parseInt($(".saleQty").val());
      var date = Router.current().params.date;

      var menuItem = MenuItems.findOne({"name": menuName});
      if(menuItem) {
        var menuItemId = menuItem._id;
        if(qty > 0) {
          Meteor.call("createSalesMenus", new Date(date), menuItemId, qty, function(err, id) {
            if(err) {
              if(err.reason == "Menu item already added") {
                alert("Menu item already added");
                $(".saleItem").focus();
              } else {
                console.log(err);
                return alert(err.reason);
              }
            } else {
              $('.saleItem').val("");
              $(".saleItem").focus();
              $(".saleQty").val("");
            }
          });
        }
      }
    }
  }
});