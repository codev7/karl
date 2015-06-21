Template.weeklyRosterDay.events({
  'click .addShiftBox': function(event) {
    event.preventDefault();
    var inbox =  $(event.target).closest(".ibox-content");
    var mainUl = $(inbox).find("ul");
    var hiddenBox = $("#hidden-success-box").children().clone();
    $(mainUl).append(hiddenBox);
    console.log(".................", inbox);
    console.log(".................", mainUl);
    $("li.success-element").mouseenter(function(){
      $(event.target).find('.box-wrapper').show();
    }).mouseleave(function(){
      $(event.target).find('.box-wrapper').hide();
    })
    // initEditable();
    // mouseOverCrossToggle();
  }
});