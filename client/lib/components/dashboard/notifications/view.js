Template.notificationsList.events({
  'click .newNoti': function(event) {
    event.preventDefault();
    Session.set("notifiState", false);
    $(event.target).addClass("label-primary");
    $(".readNoti").removeClass("label-primary");

  },

  'click .readNoti': function(event) {
    event.preventDefault();
    Session.set("notifiState", true);
    $(event.target).addClass("label-primary");
    $(".newNoti").removeClass("label-primary");
  }
});