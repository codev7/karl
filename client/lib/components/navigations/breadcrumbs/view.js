Template.breadcrumbs.helpers({
  categoriesList: function() {
    return Categories.find().fetch();
  },

  statusList: function() {
    var status = [
      {"status": "All", "value": 'all'},
      {"status": "Active", "value": "active"},
      {"status": "Ideas", "value": "ideas"},
      {"status": "Archived", "value": "archived"}
    ];
    return status;
  },

  isMyCategory: function(id) {
    var category = Session.get("category");
    if(id == "all" && category == "all") {
      return true;
    } else if(category == id) {
      return true;
    } else {
      return false;
    }
  },

  isMyStatus: function(id) {
    var status = Session.get("status");
    if(id == "all" && status == "all") {
      return true;
    } else if(status == id) {
      return true;
    } else {
      return false;
    }
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