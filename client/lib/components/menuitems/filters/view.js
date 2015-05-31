Template.menuFilters.events({
  // 'change .categorizedMenus': function(event) {
  //   event.preventDefault();
  //   var category = $(event.target).val();
  //   var status = Router.current().params.status;
  //   Router.go("menuItemsMaster", {'category': category, "status": status});
  // },

  'change .menuStatus': function(event) {
    event.preventDefault();
    var category = Router.current().params.category;
    var status = $(event.target).val();
    Router.go("menuItemsMaster", {'category': category, "status": status});
  }
});