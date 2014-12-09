Template.workersList.rendered = function() {
  this.autorun(function() {
    $("#workersList").sortable({
      connectWith: ".shiftedWorkers"
    });
  });  
}

Template.workersList.helpers({
  "workers": function() {
    var workers = Workers.find({"availability": true}).fetch();
    return workers;
  }
});