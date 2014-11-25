Template.innerHeader.helpers({
  "dateTitle": function() {
    var date = Date.now();
    return moment(date).format("MMM Do YY")
  }
});