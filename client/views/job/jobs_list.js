Template.jobsList.rendered = function() {
  Deps.autorun(function() {
    $(".jobsList").sortable({
      connectWith: ".shift"
    });
  });  
}