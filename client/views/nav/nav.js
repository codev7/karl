Template.nav.events({
  'click #addJob': function(e, instance) {
    $("#submitJobModal").modal("show");
  },

  'click #addShift': function(e, instance) {
    $("#submitShiftModal").modal("show");
  },

  'click #adminPanel': function(e, instance) {
    e.preventDefault();
    Router.go("admin");
  },
  
  'click #week': function(event) {
    event.preventDefault();
    var date = moment(new Date).format("YYYY-MM-DD");
    if(Session.get("thisDate")) { 
      date = Session.get("thisDate");
    }
    Router.go("weekly", {"_date": date});
  }
});