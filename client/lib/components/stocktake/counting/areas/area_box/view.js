Template.areaBox.events({
 'click .garea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("activeGArea", id);
  },

  'click .sarea-filter': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Session.set("activeSArea", id);
  }
});

Template.areaBox.helpers({
  activeG: function(id) {
    var garea = Session.get("activeGArea");
    if(garea == id) {
      return true;
    } else {
      return false;
    }
  },

   activeS: function(id) {
    var sarea = Session.get("activeSArea");
    if(sarea == id) {
      return true;
    } else {
      return false;
    }
  },
  
  inActive: function(id) {
    var sarea = Session.get("activeSArea");
    var garea = Session.get("activeGArea");
    if((sarea != id) && (garea != id)) {
      return true;
    } else {
      return false;
    }
  },

});