Template.breadcrumbs.helpers({
  categoriesList: function() {
    return Categories.find().fetch();
  }
});

Template.breadcrumbs.events({
  'click .categorizedMenus': function(event) {
    event.preventDefault();
    var category = $(event.target).attr("data-id");
    var status = Router.current().params.status;
    $(event.target).addClass("btn-primary").removeClass("btn-white");
    Router.go("menuItemsMaster", {'category': category, "status": status});
  },

  'click .menuStatus': function(event) {
    event.preventDefault();
    $(event.target).addClass("btn-primary").removeClass("btn-white");
    var category = Router.current().params.category;
    var status = $(event.target).attr("data-status");
    Router.go("menuItemsMaster", {"category": category, "status": status});
  }
});