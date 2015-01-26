Template.workersList.rendered = function() {
  // this.autorun(function() {
  // });  
}

Template.workersList.helpers({
  "activeWorkers": function() {
    var workers = Workers.find({"resign": false}).fetch();
    return workers;
  },

  "allWorkers": function() {
    var workers = Workers.find().fetch();
    return workers;
  }
});