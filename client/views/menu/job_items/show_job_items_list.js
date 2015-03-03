Template.showJobItemsList.helpers({
  jobItemsList: function() {
    var list = JobItems.find().fetch();
    return list;
  },
});

var selectedJobItems = [];
Template.showJobItemsList.events({
  'click .selectedPrep': function(event) {
    var item = $(event.target).attr("data-id");
    var qty = $(event.target).parent().parent().find("input[type=text]").val();
    // console.log(qty);
    var index = selectedJobItems.indexOf(item);
    var isChecked = $(event.target)[0].checked;
    if(index < 0) {
      if(isChecked) {
        selectedJobItems.push(item);
      }
    } else {
      if(!isChecked) {
        selectedJobItems.splice(index, 1)
      } 
    }
  },

  'submit form': function(event) {
    event.preventDefault();
    if(selectedJobItems.length > 0) {
      console.log("selectedJobItems", selectedJobItems);
      Session.set("selectedJobItems", selectedJobItems);
    }
    $("#jobItemListModal").modal("hide");
  }
});