Template.showJobItemsList.helpers({
  jobItemsList: function() {
    var jobItem_ids = [];
    if(Router.current()) {
      var routeName = Router.current().route.getName();
      if(routeName == "menuItemEdit") {
        var id = Session.get("thisMenuItem");
        var item = MenuItems.findOne(id);
        if(item) {
          if(item.jobItems) {
            if(item.jobItems.length > 0) {
              item.jobItems.forEach(function(doc) {
                if(jobItem_ids.indexOf(doc._id) < 0) {
                  jobItem_ids.push(doc._id);
                }
              });
            }
          }
        }
      }
    }
    var list = JobItems.find({"_id": {$nin: jobItem_ids}}).fetch();
    return list;
  },
});

var selectedJobItems = [];
Template.showJobItemsList.events({
  'keyup #searchText-box': function(event) {
    var text = $(event.target).val().trim();
    FlowComponents.callAction('keyup', text);
  },

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
    var alreadySelected = Session.get("selectedJobItems");
    if(alreadySelected && alreadySelected.length > 0) {
      prep_items_doc = prep_items_doc.concat(alreadySelected);  
    } 
    if(prep_items_doc.length > 0) {
      Session.set("selectedJobItems", prep_items_doc);
    } 
    $(event.target).find('[type=checkbox]').attr('checked', false);
    $("#searchText-box").val("");
    $("#jobItemListModal").modal("hide");
    FlowComponents.callAction('submit');
  },

  'click #addNewJobItem': function(event) {
    event.preventDefault();
    $("#jobItemListModal").modal("hide");
    Router.go("submitJobItem");
  },

});