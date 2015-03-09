Template.mainMenuList.helpers({
  menusList: function() {
    return MenuItems.find();
  }
});

Template.mainMenuList.events({
  'submit form': function(event) {
    event.preventDefault();
    var menus = $(event.target).find('[name=menu_qty]').get();
    var menu_doc = [];
    menus.forEach(function(menu) {
      var dataid = $(menu).attr("data-id");
      var quantity = $(menu).val();
      quantity = parseInt(quantity);
      if(dataid && quantity) {
        if(typeof(quantity) == "number") {
          var info = {
            "id": dataid,
            "quantity": quantity
          }
          menu_doc.push(info);
        }
      }
    });
    console.log("============", menu_doc);
    Meteor.call("generateJobs", menu_doc, new Date(), function(err, jobIds) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        console.log(jobIds);
      }
    });
  }
});