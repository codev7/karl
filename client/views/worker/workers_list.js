Template.workersList.rendered = function() {
  this.autorun(function() {
    $("#workersList").sortable({
      // helper: "clone",
      connectWith: ".shiftedWorkers"
    })
    // .droppable({
    //   drop: function(event, ui) {
    //     console.log("-------#workersList");
  //       if(ui.draggable[0].dataset.title == "worker") {
  //         var workerId = ui.draggable[0].dataset.id;
  //         var shiftId = $(this).attr("data-id");
  //         Meteor.call("assignWorkerToShift", workerId, shiftId, function(err) {
  //           if(err) {
  //             return alert(err.reason);
  //           }
  //         });
  //       }
    //   }
    // });
  });  
}

Template.workersList.helpers({
  "workers": function() {
    var workers = Workers.find({"availability": true}).fetch();
    return workers;
  }
});