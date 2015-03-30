Template.jobItemsList.helpers({
  jobItemsList: function() {
    var list = JobItems.find().fetch();
    return list
  }
});