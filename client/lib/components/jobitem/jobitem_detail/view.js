

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