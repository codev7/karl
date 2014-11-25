Template.submitWorker.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();

    if(!name || name.trim() == "") {
      alert("Please add title for your worker");
    } else {
      var info = {
        "name": name,
        "type": type
      }
      Meteor.call("createWorker", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#submitWorkerModal").modal("hide");
        }
      });
    }
  }
});
