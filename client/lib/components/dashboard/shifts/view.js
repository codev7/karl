Template.shiftsSummary.events({
  'click .futureShifts': function(event) {
    event.preventDefault();
    Session.set("shiftState", "future");
    $(event.target).parent().children("span").removeClass("label-primary")
    $(event.target).addClass("label-primary");
  },

  'click .pastShifts': function(event) {
    event.preventDefault();
    Session.set("shiftState", "past");
    $(event.target).parent().children("span").removeClass("label-primary")
    $(event.target).addClass("label-primary");
  },

  'click .openShifts': function(event) {
    event.preventDefault();
    Session.set("shiftState", "open");
    $(event.target).parent().children("span").removeClass("label-primary")
    $(event.target).addClass("label-primary");
  }
});