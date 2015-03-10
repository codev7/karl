Template.menuListSubmit.helpers({
  menusList: function() {
    return MenuItems.find();
  }
});

Template.menuListSubmit.events({
  'submit form': function(event) {
    event.preventDefault();
    var menu_items = $(event.target).find('[name=menu_item]').get();
    var menu__items_doc = [];
    console.log("......" ,menu_items);
    menu_items.forEach(function(menuItem) {
      var dataid = $(menuItem).attr("data-id");
      var check = $(menuItem).is(':checked');
      if(dataid && check) {
        console.log(menuItem, check);
        menu__items_doc.push(dataid);
      }
    });
    console.log("============", menu__items_doc);
    // Meteor.call("generateJobs", menu_doc, new Date(), function(err, jobIds) {
    //   if(err) {
    //     console.log(err);
    //     return alert(err.reason);
    //   } else {
    //     console.log(jobIds);
    //   }
    // });
  }
});