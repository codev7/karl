Template.salesRangedListedView.events({
  'click .btnGo': function(event) {
    event.preventDefault();
    var count = $(".daysCount").val();
    console.log("...........", count);
    Session.set("daysRangeCount", count);
  }
});