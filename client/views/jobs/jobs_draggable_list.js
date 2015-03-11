Template.jobsDraggableList.helpers({
  "jobs": function() {
    var jobs = Jobs.find({"onshift": null, "status": "draft"}).fetch();
    console.log(jobs);
    return jobs;
  }
});