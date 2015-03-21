Template.jobItemDetail.helpers({
  item: function() {
    var id = Session.get("thisJobItem");
    var item = getPrepItem(id);
    if(item) {
      if(!item.labourCost) {
        item.labourCost = 0;
      }
      return item;
    }
  }
});

Template.jobItemDetail.events({
  'click .editJobItemBtn': function(event) {
    event.preventDefault();
    Router.go("jobItemEdit", {'_id': Session.get("thisJobItem")});
  },

  'click .printJobItemBtn': function(event) {
    event.preventDefault();
    print();
  }
});