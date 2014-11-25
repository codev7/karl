Template.jobsList.rendered = function() {
  Deps.autorun(function() {
    $(".jobsList").sortable({
      // helper: "clone",
      connectWith: ".shift"
    });
  });  
}

Template.jobsList.helpers({
  "jobs": function() {
    var jobs = Jobs.find().fetch();
    console.log(".........", jobs);
    return jobs;
  }
});