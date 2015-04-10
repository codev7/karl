Template.salesRangedListedView.events({
  'click .btnGo': function(event) {
    event.preventDefault();
    var count = $(".daysCount").val();
    Session.set("daysRangeCount", count);
    Meteor.call("getRangedData",  parseInt(count), function(err, doc) {
      if(err) {
        console.log(err);
      } else {
        console.log(doc);
        return doc;
      }
    });
  }
});

Template.salesRangedListedView.helpers({
  range: function() {
    return Session.get("daysRangeCount");
  }
});