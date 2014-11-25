Template.shiftItem.rendered = function() {
  Deps.autorun(function() {
    $(".shift").sortable({
      // helper: "clone",
      connectWith: ".jobsList, .jobs"
    })
    .droppable({greedy: true });
  }); 
}

Template.shiftItem.helpers({
  "shifts": function() {
    var shifts = Shifts.find().fetch();
    return shifts;
  }
});