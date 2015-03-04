Template.jobItemDetailed.helpers({
  'cost': function() {
    var item = this;
    var cost = 0;
    if(item && item.ingredients) {
      if(item.ingredients.length > 0) {
        item.ingredients.forEach(function(doc) {
          if(doc.id) {
            var ing_doc = Ingredients.findOne(doc.id);
            cost += parseInt(ing_doc.unitPrice) * doc.quantity;
          }
        });
      }
    }
    return cost;
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