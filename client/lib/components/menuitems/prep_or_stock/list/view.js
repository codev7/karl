Template.showListOfIngs.events({
  "keyup #searchText-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    FlowComponents.callAction('keyup', text);
  }, 200)
});

Template.showListOfIngs.rendered = function() {
  console.log("......rendered...............");
}