Template.userDetailed.helpers({
  item: function() {
    var doc = {};
    doc.email = this.emails[0].address;
    doc.type = getUserType(this._id);
    return doc;
  }
});

Template.userDetailed.events({
  'click .changeUserPermission': function(event) {
    event.preventDefault();
    var type = $(event.target).attr("data-type");
    console.log(this, type);
    Meteor.call("changeUserPermission", this._id, type, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});