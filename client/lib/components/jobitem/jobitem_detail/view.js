Template.jobItemDetail.helpers({
  item: function() {
    var id = Session.get("thisJobItem");
    var item = getPrepItem(id)
    if(item) {
      item.ingsListView = false;
      if(item.ingredients.length > 0) {
        item.ingsListView = true;
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