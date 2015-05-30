Template.addNewStatus.events({
  'submit form': function(event) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    if(!name) {
      alert("Status name should have a value");
    }
    Meteor.call('createStatus', name, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        $(event.target).find('input').val("");
        $("#addStatusModal").modal('hide');
      }
    });
  }
});