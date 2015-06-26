Template.jobItemDetailed.events({
  'click .viewDetail': function(event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Router.go("jobItemDetailed", {_id: id});
  }
});