Template.jobsList.helpers({
  "jobs": function() {
    var jobs = Jobs.find({"onshift": null, "status": "draft"}).fetch();
    console.log(jobs);
    return jobs;
  }
});

// Template.jobsList.rendered = function() {
//   this.autorun(function() {
//     $("#jobsList").sortable({
//       disabled: false,
//       items: ".jobitem",
//       revert: true,
//       connectWith: ".shiftedJobs",
//       dropOnEmpty: true,
//       tolerance: "fit"
//     })
//     .droppable({
//       accept: ".assigned",
//       tolerance: "intersect",
//       drop: function(event, ui) {
//         if(ui.draggable[0].dataset.title == "assigned") {
//           var jobId = ui.draggable[0].dataset.id;
//           var shiftId = $(this).attr("data-id");
//           Meteor.call("assignJob", jobId, shiftId, function(err) {
//             if(err) {
//               alert(err.reason);
//               return;
//             } 
//           });
//         } else {
//           return event;
//         }
//       }
//     });
//   });  
// }
