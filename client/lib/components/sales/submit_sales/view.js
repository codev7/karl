Template.submitSales.events({
  'click .createSalesMenu': function(event) {
    event.preventDefault();
    var date = $("#salesMenuDate").val();
    console.log(".......", date);
    Meteor.call("createSalesMenu", date, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        $(".salesMenuTable").removeClass("hide");
      }
    });
  }
});