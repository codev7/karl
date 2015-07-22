Template.profileMainView.helpers({
  'id': function() {
    var id = Router.current().params._id;
    return id;
  }
});