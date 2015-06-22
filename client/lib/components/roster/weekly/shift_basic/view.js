Template.shiftBasic.events({
  'click .addShiftBox': function(event) {
    event.preventDefault();
    var day = $(event.target).attr("data-day");
    var inbox =  $(event.target).closest(".ibox-content");
    var mainUl = $(inbox).find("ul");
    var hiddenBox = $("#hidden-success-box").children().clone();
    $(mainUl).append(hiddenBox);
    mouseOverCrossToggle();
  },

  'click .removeRosterBox': function(event) {
    event.preventDefault();
    var delElement = $(event.target).closest('li');
    delElement.remove();
  },

  'mouseenter li.success-element': function(event) {
    console.log("...............");
    event.preventDefault();
    $(event.target).find('.box-wrapper').show();
  },

  'mouseleave .success-element': function(event) {
    console.log("-----------------");
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

  $('.section').editable();
}