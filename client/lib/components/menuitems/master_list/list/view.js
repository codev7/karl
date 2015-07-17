Template.menuItemsList.events({
  'keyup #searchMenuItemsBox': function(event) {
    var name = $(event.target).val();
    FlowComponents.callAction("keyup", name);
  },

  'click #loadMoreMenuItems': function(event) {
    event.preventDefault();
    FlowComponents.callAction("loadMore");
  }
});