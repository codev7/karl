Template.jobItem.rendered = function() {
  Deps.autorun(function() {
    $(".jobitem").sortable();
  });  
}