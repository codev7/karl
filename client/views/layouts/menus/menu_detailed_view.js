Template.menuDetailedView.helpers({
  name: function() {
    var id = Session.get("thisMenu");
    var name = Menus.findOne(id).name;
    return name;
  }
});