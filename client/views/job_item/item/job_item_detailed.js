Template.jobItemDetailed.helpers({
  'cost': function() {
    if(this) {
      var id = this._id;
      var item = getPrepItem(id);
      if(item) {
        return item.prepCostPerPortion;
      }
    }
  }
});

Template.jobItemDetailed.events({
  'click .deleteJobItem': function(event) {
    event.preventDefault();
    if(this) {
      Meteor.call("deleteJobItem", this._id, function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        }
      });
    }
  }
});