// Template.jobItemEdit.helpers({
//   item: function() {
//     if(this) {
//       if(this._id) {
//         var item = getPrepItem(this._id);
//         if(item) {
//           return item;
//         }
//       } 
//     }
//   }
// });

Template.jobItemEdit.events({
  'click .removePrep': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var jobItemsList = Session.get("selectedJobItems");
    if(jobItemsList) {
      if(jobItemsList.length > 0) {
        var index = jobItemsList.indexOf(id);
        if(index >= 0) {
          jobItemsList.splice(index, 1);
          Session.set("selectedJobItems", jobItemsList);
        }
      }
    }
    var item = $(event.target).parent().parent();
    $(item).remove();
  }
});