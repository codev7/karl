Template.workersList.rendered = function() {
  Deps.autorun(function() {
    $(".workersList").sortable({
      // helper: "clone",
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