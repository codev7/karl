Template.submitWorker.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    var type = $(event.target).find('[name=type]').val();
    var wage = $(event.target).find('[name=wage]').val();
    var limit = $(event.target).find('[name=hours]').val();

    if(!name || name.trim() == "") {
      alert("Please add title for your worker");
    } else {
      var info = {
        "name": name,
        "type": type,
        "wage": wage,
        "limit": limit
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

Template.submitWorker.helpers({
  'workerTypes': function() {
    return WorkerTypes.find();
  }
});
