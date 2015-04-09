Template.salesListedView.helpers({
  date: function() {
    var date = Router.current().params.date;
    return date;
  }
});