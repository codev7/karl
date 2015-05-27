Template.jobItemsList.events({
  'keyup #searchJobItemsBox': _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200),

  'click #loadMoreJobItems': _.throttle(function(e) {
    e.preventDefault();
    FlowComponents.callAction('click');
  }, 200)
});