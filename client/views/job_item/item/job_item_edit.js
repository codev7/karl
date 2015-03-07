Template.jobItemEdit.helpers({
  costPerPortion: function() {
    var id = null;
    if(this) {
      if(this.id) {
        id = this.id;
      } else if(this._id) {
        id = this._id;
      } 
      if(id) {
        var item = getPrepItem(id);
        if(item) {
          return item.prepCostPerPortion;
        }
      }
    }
  }
});

Template.jobItemEdit.events({
  'click .removePrep': function(event) {
    event.preventDefault();
    var routename = Router.current().route.getName();
    var id = $(event.target).attr("data-id");
    if(routename == "menuItemEdit") {
      var menuId = Session.get("thisMenuItem");
      if(id) {
        // Meteor.call("removeIngredients", menuId, id, function(err) {
        //   if(err) {
        //     console.log(err);
        //     return alert(err.reason);
        //   }
        // });
      } else {
        var item = $(event.target).parent().parent();
        $(item).remove();
      }
    } else if(routename == "jobItemEdit") {
      var jobId = Session.get("thisJobItem");
      if(id) {
        // Meteor.call("removeIngredientsFromJob", jobId, id, function(err) {
        //   if(err) {
        //     console.log(err);
        //     return alert(err.reason);
        //   }
        // });
      } else {
        var item = $(event.target).parent().parent();
        $(item).remove();
      }
    }
  }
});