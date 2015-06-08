Template.schedulingJob.events({
  'click .set-job-status': function(event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("setJobStatus", id, function(err) {
      if(err) {
        return alert(err.reason);
      }
    }); 
  }
});

Template.schedulingJob.rendered = function() {
  $('#external-events div.external-event').each(function() {
    // store data so the calendar knows to render an event upon drop
    $(this).data('event', {
      title: $.trim($(this).text()), // use the element's text as the event title,
      id: $(this).attr("data-id"),
      stick: true // maintain when user navigates (see docs on the renderEvent method)
    });
    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 1111999,
      revert: true,      // will cause the event to go back to its
      revertDuration: 0  //  original position after the drag
    });
  });
}