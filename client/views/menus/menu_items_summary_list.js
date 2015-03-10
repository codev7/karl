Template.menuItemsSummaryList.helpers({
  'items': function() {
    var menu = Menus.findOne();
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