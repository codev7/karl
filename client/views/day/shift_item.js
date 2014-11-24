Template.shiftItem.rendered = function() {
  Deps.autorun(function() {
    $(".shift").sortable({
       connectWith: ".jobsList, .shift"
    })
    .droppable({greedy: true });
  }); 
}