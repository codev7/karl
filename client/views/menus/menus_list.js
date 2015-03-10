Template.menusList.helpers({
  menusList: function() {
    return Menus.find().fetch();
  }
});