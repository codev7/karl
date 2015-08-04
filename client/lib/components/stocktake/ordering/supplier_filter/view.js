Template.supplierFilter.events({
  'click .activateSupplier': function(event) {
    event.preventDefault();
    var supplier = $(event.target).attr("data-id");
    Session.set("activeSupplier", supplier);
  },

  'click .orderByEmail': function(event) {
    event.preventDefault();
    var supplier = Session.get("activeSupplier");
    var stocktakeDate = Session.get("thisDate");
    Meteor.call("generateReceipts", stocktakeDate, supplier, "email", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  },

  'click .orderByPhone': function(event) {
    event.preventDefault();
    var supplier = Session.get("activeSupplier");
    var stocktakeDate = Session.get("thisDate");
    console.log("........order by phone", supplier, stocktakeDate);
    Meteor.call("generateReceipts", stocktakeDate, supplier, "phone", function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      }
    });
  }
});