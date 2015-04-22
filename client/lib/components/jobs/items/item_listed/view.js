Template.jobListed.events({
  'click .deleteJob': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    console.log("........", id);
  }
});