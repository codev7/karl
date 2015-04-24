Template.cafeSalesForecastEditList.events({
  'click .generateJobs': function(event) {
    console.log("...................");
    var menu = $(".menuForecastQty").get();
    var menuIds = []; 
    var doc = [];
    menu.forEach(function(item) {
      var qty = $(item).val();
      var id = $(item).attr("data-id");
      if(menuIds.indexOf(id) < 0) {
        menuIds.push(id);
        var obj = {
          "id": id,
          "quantity": qty
        }
        doc.push(obj);
      }
    });
    console.log("--------------", doc);
  }
});