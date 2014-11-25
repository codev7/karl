Template.submitJob.events({
  'submit form': function(event, instance) {
    event.preventDefault();
    var name = $(event.target).find('[name=name]').val();
    // var type = $(event.target).find('[name=name]').val();;
    var details = $(event.target).find('[name=details]').val();
    // var portions = $(event.target).find('[name=portions]').val();;
    var activeTime = $(event.target).find('[name=activeTime]').val();
    var ingCost = $(event.target).find('[name=ingCost]').val();
    var shelfLife = $(event.target).find('[name=shelfLife]').val();
    
    if(!name || name.trim() == "") {
      alert("Please add title for your job");
    } else if(!activeTime || !activeTime.trim() == "") {
      alert("Please add active time for your job");
    } else {
      var info = {
        "name": name,
        "type": null,
        "details": details,
        "portions": null,
        "activeTime": activeTime,
        "ingCost": ingCost,
        "shelfLife": shelfLife
      }
      Meteor.call("createJob", info, function(err, id) {
        if(err) {
          return alert(err.reason);
        } else {
          $("#submitJobModal").modal("hide");
        }
      });
    }
  }
});