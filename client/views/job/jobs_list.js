Template.jobsList.rendered = function() {
  Deps.autorun(function() {
    $(".jobsList").sortable({
      // helper: "clone",
      connectWith: ".shift"
    });
  });  
}