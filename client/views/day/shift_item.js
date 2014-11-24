Template.shiftItem.rendered = function() {
  Deps.autorun(function() {
    $(".shift").sortable({
      // helper: "clone",
      connectWith: ".jobsList, .shift"
    })
    .droppable({greedy: true });
  }); 
}