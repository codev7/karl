Template.adminNav.events({
  'click #addMenuItems': function(e, instance) {
    e.preventDefault();
    Router.go("submitMenuItem");
  },

  'click #addJobItems': function(e, instance) {
    e.preventDefault();
    Router.go("submitJobItem");
  }
});

