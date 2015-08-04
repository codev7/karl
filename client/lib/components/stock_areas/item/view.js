Template.areaItem.events({
  'keypress .sarea': function(event) {
    if(event.keyCode == 13) {
      var name = $(event.target).val();
      var id = $(event.target).closest("li").attr("data-id");
      if(name) {
        Meteor.call("createSpecialArea", name, id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          } else {
            $(event.target).focus();
          }
        });
      }
    }

  }
});