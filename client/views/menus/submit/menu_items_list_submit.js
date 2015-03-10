Template.menuItemsListSubmit.helpers({
  menusList: function() {
    return MenuItems.find();
  }
});

Template.menuItemsListSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var menu_items = $(event.target).find('[name=menu_item]').get();
    var name = $(event.target).find("[name=nameForMenu]").val().trim();
    if(name) {
      name = name; 
    } else {
      name = null;
    }
    var menu__items_doc = [];
    menu_items.forEach(function(menuItem) {
      var dataid = $(menuItem).attr("data-id");
      var check = $(menuItem).is(':checked');
      if(dataid && check) {
        menu__items_doc.push(dataid);
      }
    });
    if(menu__items_doc.length > 0) {
      Meteor.call("createMenu", name, menu__items_doc, function(err, jobIds) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          Router.go("menus");
        }
      });
    }
  }
});