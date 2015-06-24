Template.notifiModal.events({
  'click .backToTemplate': function(event) {
    event.preventDefault();
    $("#notifiModal").modal("hide");
  },

  'click .toWeek': function(event) {
    event.preventDefault();
    $("#notifiModal").modal("hide");
    Router.go("weeklyRoster", {"week": Session.get("templateToWeek")})
  }
});