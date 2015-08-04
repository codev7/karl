Template.areaFilters.events({
  'click .addNewGArea': function(event) {
    event.preventDefault();
    var div = '<a class="btn btn-block btn-default btn-sm"><input class="form-control gareaName" placeholder="Add name"/></div></a>'
    $(event.target).before(div);
    $(event.target).text("Save").removeClass("addNewGArea").addClass("saveGArea")
  },

  'click .saveGArea': function(event) {
    event.preventDefault();
    var name = $(event.target).parent().find('input').val();
    Meteor.call("createGeneralArea", name.trim(), function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        $(event.target).parent().find('input').parent().remove();
        $(event.target).text("Add").removeClass("saveGArea").addClass("addNewGArea")
      }
    });
  },

  'click .addNewSArea': function(event) {
    event.preventDefault();
    var div = '<a class="btn btn-block btn-default btn-sm"><input class="form-control sareaName" placeholder="Add name"/></div></a>'
    $(event.target).before(div);
    $(event.target).text("Save").removeClass("addNewSArea").addClass("saveSArea")
  },

  'click .saveSArea': function(event) {
    event.preventDefault();
    var id = Session.get("activeGArea");
    var name = $(event.target).parent().find('input').val();
    Meteor.call("createSpecialArea", name.trim(), id, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        $(event.target).parent().find('input').parent().remove();
        $(event.target).text("Add").removeClass("saveSArea").addClass("addNewSArea")
      }
    });
  }
});