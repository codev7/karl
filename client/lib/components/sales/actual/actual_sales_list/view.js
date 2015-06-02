Template.actualSalesList.helpers({
  date: function() {
    var date = Router.current().params.date;
    return date;
  }
});

Template.actualSalesList.rendered = function() {
  $('.sales-menu-table').tooltip({
    selector: "[data-toggle=tooltip]",
    container: "body"
  });
}