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
  }
});

Template.shiftBasic.rendered = function() {
  $(".select-worker").editable({
    source: [ // TODO: Import this list dynamically from server
      {id: '0', text: 'Select worker'},
      {id: 'emp1', text: 'Employee 1'},
      {id: 'emp2', text: 'Employee 2'},
      {id: 'emp3', text: 'Employee 3'}
    ]
  });

  $('.section').editable();
}

 function mouseOverCrossToggle(){
  $("li.success-element").mouseenter(function(){
    $(this).find('.box-wrapper').show();
  }).mouseleave(function(){
    $(this).find('.box-wrapper').hide();
  })
}