Template.shiftBasic.events({
  'click .removeRosterBox': function(event) {
    event.preventDefault();
    var delElementId = $(event.target).closest('li').attr("data-id");
    FlowComponents.callAction("deleteShift", delElementId);
  },

  'mouseenter li.success-element': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .success-element': function(event) {
    event.preventDefault();
    $(event.target).find('.box-wrapper').hide();
  }
});