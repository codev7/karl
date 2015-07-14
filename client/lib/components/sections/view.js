Template.sections.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=sectionName]').val();
    if(name) {
      Meteor.call("createSection", name.trim(), function(err) {
        if(err) {
          console.log(err);
          return alert(err.reason);
        } else {
          $(event.target).find('[name=sectionName]').val("");
        }
      });
    }
  },

  'click .deleteSection': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    var confirmDelete = confirm("Are you sure you want to delete this section?");
    if(confirmDelete) {
      if(id) {
        Meteor.call("deleteSection", id, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason)
          }
        });
      }
    }
  }
});