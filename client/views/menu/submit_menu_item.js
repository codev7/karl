Template.submitMenuItem.events({
  'click .addjob': function(e, instance) {
    e.preventDefault();
    var htmlInput = "<input type='text' name='jobItems' class='form-control'/> <br/>"
    $(".jobItemsList").append(htmlInput)
  }
});