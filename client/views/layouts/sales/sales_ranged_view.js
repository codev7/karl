Template.salesRangedListedView.events({
  'click .btnGo': function(event) {
    event.preventDefault();
    var count = $(".daysCount").val();
    Session.set("daysRangeCount", count);
  }
});

Template.salesRangedListedView.helpers({
  range: function() {
    return Session.get("daysRangeCount");
  }
});