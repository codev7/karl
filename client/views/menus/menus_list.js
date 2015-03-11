Template.menusList.helpers({
  menusList: function() {
    var items = Menus.find().fetch();
    return items;   
  }
});