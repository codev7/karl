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
    var id = $(event.target).closest("tr").attr("data-id");
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

Template.sections.rendered = function() {
  $('.editSection').editable({
    type: "text",
    title: 'Edit section name',
    showbuttons: true,
    display: false,
    mode: 'inline',
    success: function(response, newValue) {
      var id = $(this).closest("tr").attr("data-id");
      if(id) {
        Meteor.call("editSection", id, newValue, function(err) {
          if(err) {
            console.log(err);
            return alert(err.reason);
          }
        });
      }
    }
  });
}