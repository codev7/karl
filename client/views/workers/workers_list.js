Template.workersList.rendered = function() {
  // this.autorun(function() {
  // });  
}

Template.workersList.helpers({
  "workers": function() {
    var workers = Workers.find({"resign": false}).fetch();
    return workers;
  },

  "res_workers": function() {
    var workers = Workers.find({"resign": true});
    return workers;
  }
});