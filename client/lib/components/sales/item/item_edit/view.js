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
          FlowComponents.callAction("submit", date, menuItemId, qty);
        }
      }
    }
  }
});