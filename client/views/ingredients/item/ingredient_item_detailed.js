// Template.ingredientItemDetailed.events({
//   'click .editIngredient': function(event) {
//     event.preventDefault();
//     Session.set("thisIngredient", this);
//   },

//   'click .deleteIngredient': function(event) {
//     event.preventDefault();
//     var result = confirm("Are you sure, you want to delete this item ?");
//     if (result == true) {
//       Meteor.call("deleteIngredient", this._id, function(err) {
//         if(err) {
//           console.log(err);
//           return alert(err.reason);
//         }
//         IngredientsListSearch.cleanHistory();
//         IngredientsListSearch.search("", {"limit": 10});
//       });
//     }
//   }
// });

// Template.ingredientItemDetailed.rendered = function() {
//   // $('[data-toggle="tooltip"]').tooltip();
// }