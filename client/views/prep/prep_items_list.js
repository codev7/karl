Template.prepItemsList.helpers({
  prepItemsList: function() {
    var list = JobItems.find().fetch();
    return list
  }
});