Template.jobItemsListView.events({
  'click #submitJobItem': function(event) {
    event.preventDefault();
    Router.go("submitJobItem");
  }
});