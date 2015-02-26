Template.nav.events({
  'click #adminPanel': function(e, instance) {
    e.preventDefault();
    Router.go("admin");
  },

  'click #daily': function(event) {
    event.preventDefault();
    var date = moment(new Date()).format("YYYY-MM-DD");
    if(Session.get("thisDate")) { 
      date = Session.get("thisDate");
    }
    Router.go("daily", {"_date": date});
  },
  
  'click #week': function(event) {
    event.preventDefault();
    var date = moment(new Date()).format("YYYY-MM-DD");
    if(Session.get("thisDate")) { 
      date = Session.get("thisDate");
    }
    Router.go("weekly", {"_date": date});
  }
});