Template.shiftsSummary.events({
  'click .futureShifts': function(event) {
    event.preventDefault();
    Session.set("shiftState", true);
    $(event.target).addClass("label-primary");
    $(".pastShifts").removeClass("label-primary");
  },

  'click .pastShifts': function(event) {
    event.preventDefault();
    Session.set("shiftState", false);
    $(event.target).addClass("label-primary");
    $(".futureShifts").removeClass("label-primary");
  },
});