Template.menuItemsSummaryList.helpers({
  'items': function() {
    var id = Session.get("thisMenu");
    var menu = Menus.findOne(id);
    console.log(menu);
    if(menu) {
      var menuItems = menu.menuItems;
      if(menuItems.length > 0) {
        var items = MenuItems.find({"_id": {$in: menuItems}});
        return items;
      }
    }
  }
});

Template.menuItemsSummaryList.events({
  'submit form': function(event) {
    event.preventDefault();
    var menu_items = $(event.target).find("[name=item_qty]").get();

    var menu__items_doc = [];
    menu_items.forEach(function(menuItem) {
      var dataid = $(menuItem).attr("data-id");
      var qty = $(menuItem).val();
      if(dataid && qty) {
        var info = {
          "id": dataid,
          "quantity": parseInt(qty)
        }
        menu__items_doc.push(info);
      }
    });
    console.log(".........", menu__items_doc);
    if(menu__items_doc.length > 0) {
      Meteor.call("generateJobs", menu__items_doc, new Date(), function(err, ids) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          var date = moment(new Date()).format("YYYY-MM-DD");
          Router.go("jobs", {"date": date});
        }
      });
    }
  }
});