Template.showJobItemsList.helpers({
  jobItemsList: function() {
    var list = JobItems.find().fetch();
    console.log(list);
    return list;
  },
});

var selectedJobItems = [];
Template.showJobItemsList.events({
  'click .selectedIng': function(event) {
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
        console.log("...remove.");
        selectedJobItems.splice(index, 1)
      } 
    }
  }
});