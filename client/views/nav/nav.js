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
    Router.go("shiftsDaily", {"_date": date});
  },
  
  'click #week': function(event) {
    event.preventDefault();
    var date = moment(new Date()).format("YYYY-MM-DD");
    if(Session.get("thisDate")) { 
      date = Session.get("thisDate");
    }
    Router.go("weekly", {"_date": date});
  },

  'click #jobsPanel': function(event) {
    event.preventDefault();
    var date = new Date().toISOString().slice(0,10).replace(/-/g,"-");
    Router.go("jobs", {"date": date});
  },

  'click #salesMaster': function(event) {
    event.preventDefault();
    Router.go("salesMaster");
  }
});

Template.nav.helpers({
  'isAdmin': function() {
    return isAdmin();
  }
});