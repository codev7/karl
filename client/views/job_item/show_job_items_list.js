Template.showJobItemsList.helpers({
  jobItemsList: function() {
    var list = JobItems.find().fetch();
    return list;
  },
});

var selectedJobItems = [];
Template.showJobItemsList.events({
  'submit form': function(event) {
    event.preventDefault();
    var prep_items = $(event.target).find("[name=selectedPrep]").get();
    var prep_items_doc = [];
    prep_items.forEach(function(prep) {
      var dataid = $(prep).attr("data-id");
      var check = $(prep).is(':checked');
      if(dataid && check) {
        prep_items_doc.push(dataid);
      }
    });
    if(prep_items_doc.length > 0) {
      Session.set("selectedJobItems", prep_items_doc);
    } else {
      Session.set("selectedJobItems", null);
    }
    $("#jobItemListModal").modal("hide");
  }
});