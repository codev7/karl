Template.breadcrumbs.helpers({
  categoriesList: function() {
    return Categories.find().fetch();
  }
});

Template.breadcrumbs.events({
  'click .categorizedMenus': function(event) {
    event.preventDefault();
    var category = $(event.target).attr("data-id");
    Router.go("menuItemsMaster", {'category': category});
  }
});