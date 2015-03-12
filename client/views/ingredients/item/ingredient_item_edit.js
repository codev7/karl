Template.ingredientItemEdit.helpers({
  item: function() {
    if(this._id) {
      var item = getIngredientItem(this._id);
      if(item) {
        if(this.quantity) {
          item.quantity = this.quantity;
        }
        return item;
      }
    }
  }
});

// Template.ingredientItemEdit.events({
//   'click .removeIng': function(event) {
//     event.preventDefault();
//     var routename = Router.current().route.getName();
//     var id = $(event.target).attr("data-id");
//     console.log(id);
//     if(routename == "menuItemEdit") {
//       var menuId = Session.get("thisMenuItem");
//       if(id) {
//         Meteor.call("removeIngredients", menuId, id, function(err) {
//           if(err) {
//             console.log(err);
//             return alert(err.reason);
//           }
//         });
//       } else {
//         var item = $(event.target).parent().parent();
//         $(item).remove();
//       }
//     } else if(routename == "jobItemEdit") {
//       var jobId = Session.get("thisJobItem");
//       if(id) {
//         Meteor.call("removeIngredientsFromJob", jobId, id, function(err) {
//           if(err) {
//             console.log(err);
//             return alert(err.reason);
//           }
//         });
//       } else {
//         var item = $(event.target).parent().parent();
//         $(item).remove();
//       }
//     }
//   }
// });