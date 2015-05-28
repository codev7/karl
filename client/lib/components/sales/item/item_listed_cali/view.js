Template.salesItemsListedCali.events({
  'keypress .quantity': function(event) {
    if(event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      $(event.target).parent().parent().next().find('[type=text]').focus();
    }
  }
});