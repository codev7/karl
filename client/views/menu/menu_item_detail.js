Template.menuItemDetail.helpers({
  item: function() {
    var id = Session.get("thisMenuItem");
    if(id) {
      return MenuItems.findOne(id);
    }
  }
});

Template.menuItemDetail.events({
  'click .editBtn': function(e) {
    e.preventDefault();
    Router.go("menuItemEdit", {"_id": $(e.target).attr("data-id")})
  }
});

Template.menuItemDetail.rendered = function() {
}