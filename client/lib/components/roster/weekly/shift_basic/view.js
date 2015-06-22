Template.shiftBasic.events({
  'click .removeRosterBox': function(event) {
    event.preventDefault();
    var delElementId = $(event.target).closest('li').attr("data-id");
    LocalShifts.remove({_id: delElementId});
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

Template.shiftBasic.rendered = function() {
  $('.select-worker').editable({
      value: 2,    
      source: [
      {value: 1, text: 'Active'},
      {value: 2, text: 'Blocked'},
      {value: 3, text: 'Deleted'}
    ]
  });

  $('.section').editable({
      value: 2,    
      source: [
      {value: 1, text: 'Kitchen hand'},
      {value: 2, text: 'Baked'},
      {value: 3, text: 'Pass'}
    ]
  });
  $(".shiftStartTime").editable({
    type: 'combodate',
    title: 'Select start time',
    template: "HH:mm",
    viewformat: "hh:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    display: false,
    showbuttons: true
  });

  $(".shiftEndTime").editable({
    type: 'combodate',
    title: 'Select end time',
    template: "HH:mm",
    viewformat: "hh:mm",
    format: "YYYY-MM-DD HH:mm",
    url: '/post',
    display: false,
    showbuttons: true
  });

}